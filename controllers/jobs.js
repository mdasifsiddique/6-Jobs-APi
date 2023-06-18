const Job = require('../models/Job');
const {StatusCodes} = require('http-status-codes');
const {BadRequestError , NotFoundError} = require("../errors");

const getAllJobs = async (req , resp , next)=>{
    const userID = req.user.userID;
    const jobs = await Job.find({createdBy : userID});
    resp.status(StatusCodes.OK).json({jobs , count : jobs.length})
}

const getJob = async (req , resp , next)=>{
    // const id = req.params.id;
    // const userID = req.user.userID;
    //shortcut
    const {user : {userID} , params : {id : jobId}} = req;
    const job = await Job.findOne({createdBy : userID , _id : jobId});

    if(!job){
        throw new NotFoundError(`No job with this id ${jobId}`)
    }

    resp.status(StatusCodes.OK).json({job})
}

const createJob = async (req , resp , next)=>{
    ////----IMPORTANT WE HAVE THE USER IN REQ FROM THE AUTH MIDDLEWARE USE THAT---/////
    req.body.createdBy = req.user.userID;
    ///////////////////////////////////////////////////////////////////////////////////
    const job = await Job.create(req.body);
    resp.status(StatusCodes.CREATED).json({job});
}

const updateJob = async (req , resp , next)=>{
    const {
        user : {userID} , 
        params : {id : jobId},
        body : {company , position , status }
    } = req;

    if(!company || !position || !status){
        throw new BadRequestError('Please provide company, status & Position')
    }

    const job = await Job.findByIdAndUpdate({_id : jobId , createdBy : userID} , req.body , {
        new : true ,/////give me the updated value
        runValidators : true
    })

    if(!job){
        throw new NotFoundError(`No job with this id ${jobId}`)
    }

    resp.status(StatusCodes.OK).json({job})

}

const deleteJob = async (req , resp , next)=>{
    const {user : {userID} , params : {id : jobId}} = req;
    const job = await Job.findOneAndRemove({createdBy : userID , _id : jobId});

    if(!job){
        throw new NotFoundError(`No job with this id ${jobId}`)
    }

    resp.status(StatusCodes.OK).json({job : 'deleted succesfully'})
}


module.exports = {
    getAllJobs ,
    getJob,
    createJob,
    updateJob,
    deleteJob
}