const jwt = require('jsonwebtoken')
const {UnauthenticatedError} = require("../errors");
const User = require('../models/User');
const authMiddleWare = async (req , resp ,next)=>{
    const {authorization} = req.headers;
    if(!authorization || !authorization.startsWith('Bearer ')){
        throw new UnauthenticatedError('No Token provided');
    } 

    try {
        const token = authorization.split(' ')[1];
        const payload = jwt.verify(token , process.env.JWT_SECRET);
        /////////////WE MIGHT SEE THIS BELOW CODE SOME WHERE//////
        // const user = await User.findById(payload.userID).select('-password'); ///leaving behind password , collect all teh keys
        // req.user = user;
        ///////////////////////////////////////////////////////////////
        const {userID , name} = payload;
        req.user = { userID  , name};
        next()
    } catch (error) {
        throw new UnauthenticatedError('Not Authorize to Access this Route');
    }
}

module.exports = authMiddleWare;