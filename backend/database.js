import mongoose from "mongoose";

const url = "mongodb://127.0.0.1:27017/voting_app"
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