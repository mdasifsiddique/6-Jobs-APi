
const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    company : {
        type : String,
        required : [true , 'Please Provide company name'],
        maxLength : 50
    },
    position : {
        type : String,
        required : [true , 'Please Provide position'],
        maxLength : 100
    },
    status : {
        type : String,
        enum : ['interview','declined','pending'],
        default : 'pending'
    },
    createdBy : {
        type: mongoose.Types.ObjectId,
        ref : 'User',
        require : [true , 'Please provide User']
    }

} , {timestamps : true})

module.exports = mongoose.model('Job',JobSchema)