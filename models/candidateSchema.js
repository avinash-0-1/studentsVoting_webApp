import mongoose from "mongoose";
import bcrypt from "bcrypt"


const candidateSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    party:{
        type:String,
        required:true
    },
    age:{
        type:String,
        required:true
    },
    vote:[
        {
            user:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"User",
                required:true
            },
            votedAt:{
                type:Date,
                default:Date.now()
            }
        }
    ],
    voteCount:{
        type:Number,
        default:0,
    }
})

const candidateModel = mongoose.model('candidateSchema',candidateSchema)
export default candidateModel;