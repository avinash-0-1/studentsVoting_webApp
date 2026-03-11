import mongoose from "mongoose";
import bcrypt from "bcrypt"


const userSchema = mongoose.Schema({
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
//hashing password
userSchema.pre('save',async function(){
    if(!this.password.isModified('password')){
        return
    }
    const genSalt = await bcrypt.genSalt(10)
    const hashedPass = await bcrypt.hash(this.password,genSalt)
    this.password = hashedPass
    next()
})
//verification of hashed password
userSchema.methods.comparePass = async function(pass){
    try {
        const isMatchPass = await bcrypt.compare(pass,this.password)
        return isMatchPass
    } catch (error) {
        throw error
    }
}

const userModel = mongoose.model('userSchema',userSchema)
export default userModel
