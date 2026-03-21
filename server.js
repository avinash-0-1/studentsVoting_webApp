import express from 'express'
import db from './database.js'
import userRoute from './Routes/UserRoutes.js'
import candidateRoute from './Routes/candidatesRoute.js'

const app = express()

//---------------------------------------------------------
app.use(express.json())
app.use(express.urlencoded({extended:true}))


//---------------------Routes-------------------------------

app.use('/user',userRoute)
app.use('/candidate',candidateRoute)


app.listen(3000,()=>{
    console.log("Server Is Connected !!")
})