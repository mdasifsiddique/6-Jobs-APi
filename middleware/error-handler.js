const { StatusCodes } = require('http-status-codes');

const errorHandlerMiddleware = (err, req, res, next) => {

  // if (err instanceof CustomAPIError) {
    //   return res.status(err.statusCode).json({ msg: err.message })
    // }
  ////this is the asyn warpper error => BAD Request , unAuthorization etc
  let customError = {
    ///set default
    statusCode : err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg : err.message || 'Something went Wrong , Please try again later'
  }


  ///this is the mongoose Errors
  //-------1 = > duplicate emails /////////
  if(err.code && (err.code === 11000)){
    customError.statusCode = StatusCodes.BAD_REQUEST;
    customError.msg = `Duplicate values Entered for ${Object.keys(err.keyValue)} field , please choose another value`
  }

  //-------2 => validation error-------//
  if(err.name === 'ValidationError'){
    const va=err.errors;
    const value = Object.keys(err.errors).map(item =>{
     return item.message
    })
    customError.msg = Object.values(err.errors).map(item =>item.message).join(' , ');
    customError.statusCode = StatusCodes.BAD_REQUEST
  }

  //--------3 => cast error -------//
  if(err.name === 'CastError'){
    customError.msg =  `No item found with the id : ${err.value}`;
    customError.statusCode = StatusCodes.NOT_FOUND
  }

  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
  return res.status(customError.statusCode).json({ err : customError.msg })

}

module.exports = errorHandlerMiddleware