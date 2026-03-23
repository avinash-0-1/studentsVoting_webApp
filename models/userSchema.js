import mongoose from "mongoose";
import bcrypt from "bcrypt"


const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    id:{
        type:String,
        required:true,
        unique:true
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
        enum:["voter","admin"],
        default:'voter'
    },
    isVoted:{
        type:Boolean,
        default:false,
    }
})

//hashing password
userSchema.pre('save',async function(){
    if(!this.isModified('password')){
        return
    }
    const genSalt = await bcrypt.genSalt(10)
    const hashedPass = await bcrypt.hash(this.password,genSalt)
    this.password = hashedPass
})

//verification of hashed password
userSchema.methods.comparePassword = async function(pass){
    try {
        const isMatchPass = await bcrypt.compare(pass,this.password)
        return isMatchPass
    } catch (error) {
        throw error
    }
}

const userModel = mongoose.model('userSchema',userSchema)
export default userModel
