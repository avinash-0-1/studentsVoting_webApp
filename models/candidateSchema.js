import mongoose from "mongoose";
import bcrypt from "bcrypt"


const candidateSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    id:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        required:true,
        enum:["voter,admin"]
    },
    isVoted:{
        type:Boolean,
        default:false,
    }
})

const candidateModel = mongoose.model('candidateSchema',candidateSchema)
export default candidateModel;