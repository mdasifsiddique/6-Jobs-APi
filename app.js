require('dotenv').config();
require('express-async-errors');

//extra security packages///
const rateLimiter = require('express-rate-limit')
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');

///swagger
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');



const express = require('express');
const app = express();

//CONNECT DB
const connectDb = require("./db/connect")
///Routers//////
const authRouter = require("./routes/auth");
const jobsRouter = require("./routes/jobs");

//auth middle ware
const authMiddleWare = require("./middleware/authentication")


// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.set('trust proxy' , 1);
app.use(rateLimiter({
  windowMs : 15 * 60 *1000 , //15 minutes
  max : 100 // limit each iP to 100 request 
}))
app.use(express.json());
// extra packages
app.use(helmet());
app.use(cors());
app.use(xss());

// routes
app.get("/",(req , resp)=>{
  resp.send('<h1>Jobs API<h1><a href="/api-docs">Documentation</a>')
})
app.use('/api-docs' , swaggerUI.serve , swaggerUI.setup(swaggerDocument));
app.use("/api/v1/auth",authRouter);
app.use("/api/v1/jobs", authMiddleWare , jobsRouter);


app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
     await connectDb(process.env.MONGO_URL)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
