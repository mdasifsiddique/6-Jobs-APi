const User = require("../models/User");
const {StatusCodes} = require('http-status-codes');
const {BadRequestError , UnauthenticatedError} = require("../errors")

const register = async (req , resp , next)=>{
    // const {name , email , password} = req.body;
    // if(!name || !email || !password){
    //     throw new BadRequestError('Please provide name , email & password')
    // }
    
    const user = await User.create({...req.body});
    const token = user.createJWT()
   
    resp.status(StatusCodes.CREATED).json({user : {name : user.name} , token });
}

const login = async (req , resp , next)=>{
    const { email , password} = req.body;
    if(!email || !password){
        throw new BadRequestError('Please provide email & password')
    }

    const _user = await User.findOne({email});
    if(!_user){
        throw new UnauthenticatedError('InVAlid credential')
    }
    //compare password
    const isMatch = await _user.comparePassword(password);
    if(!isMatch){
        throw new UnauthenticatedError('InVAlid credential')
    }

    const token = _user.createJWT();
    resp.status(StatusCodes.OK).json({user : {name : _user.name} , token });
}

module.exports = {
    register ,
    login
}