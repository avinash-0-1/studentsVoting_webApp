import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const url = process.env.MONGO_URL
mongoose.connect(url)

const db = mongoose.connection

db.on('disconnected',()=>{
    console.log("DB is disconnected")
})
db.on('connected',()=>{
    console.log("DB is connected")
})
db.on('error',(error)=>{
    console.log(error,"DB ERROR")
})

export default db