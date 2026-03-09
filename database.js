import mongoose from "mongoose";

const url = ""
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