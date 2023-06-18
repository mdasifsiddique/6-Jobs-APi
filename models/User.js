
const moongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const UserSchema = new moongoose.Schema({
    name :{
        type: String,
        required : [true , 'Please provide name'],
        minLength : 3,
        maxLength : 50
    },
    email :{
        type: String,
        required : [true , 'Please provide email'],
        match : [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ , 'Please provide Valid email'],
        unique : true ///very important
    },
    password :{
        type: String,
        required : [true , 'Please provide password'],
        minLength : 6
    }
});

UserSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password , salt);
    next()
})

UserSchema.methods.createJWT =  function(){
    const token = jwt.sign({userID : this._id , name : this.name} , process.env.JWT_SECRET,{
        expiresIn : process.env.JWT_LIFETIME
    });
    return token;
}

UserSchema.methods.comparePassword = async function(canditatePassword){
    const isMatch = await bcrypt.compare(canditatePassword , this.password);
    return isMatch
}

module.exports = moongoose.model('User',UserSchema)