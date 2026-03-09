import express from 'express'

const app = express()

//------------------------------------------------------
app.use(express.json())
app.use(express.urlencoded({extended:true}))


//---------------------Routes-------------------------------

app.use


app.listen(3000,()=>{
    console.log("Server Is Connected !!")
})