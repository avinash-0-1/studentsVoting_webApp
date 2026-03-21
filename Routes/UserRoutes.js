import express from 'express'
import userModel from '../models/userSchema.js'
import { jwtMiddleware , generateToken } from '../jwt.js'

const userRoute = express.Router()

userRoute.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body
        const user = await userModel.findOne({ username: username })

        if (!username) {
            return res.send('Invalid username')
        }
        const isMatchPass = await user.comparePassword(password)
        if (!isMatchPass) {
            return res.send('Invalid Password')
        }

        const payload = {
            id: user.id,
            username: user.username
        }

        const token = generateToken(payload)
        res.status(200).json({ token })
    } catch (error) {
        res.status(500).json({ message: 'Server Side ERROR' })
    }

})

userRoute.post('/signup', async (req, res) => {
    try {
        const data = req.body
        const newData = new userModel(data)
        const response = await newData.save()

        const payload = {
            id: response.id,
        }

        const token = generateToken(payload)
        
        res.status(200).json({ response: response, token: token })
    } catch (error) {
        console.log(error,"ERROR")
        res.status(500).json({ message: "Server Side ERROR" })
    }
})

userRoute.get('/profile', async (req, res) => {
    try {
        const id = req.user.id
        const response = await userModel.findById(id)
        res.json({ response })
    } catch (error) {
        res.status(500).json({ message: "server side ERROR" })
    }
})

userRoute.put('/profile/passwordupdate', async (req, res) => {
    try {
        const userId = req.user.id   // ye "req.user.id" JWT ka token verification wala user hai..!! 
        const { currentpassword, newpassword } = req.body
        const user = await userModel.findById(userId)
        const isMatchPass = await user.comparePassword(currentpassword)
        if (!isMatchPass) {
            res.status(401).json({ message: "Invalid Password" })
        }
        user.password = newpassword
        await user.save()
        res.status(200).json({message:"Password Updated"})
    } catch (error) {
        res.status(500).json({ message: 'Server side ERROR' })
    }
})

export default userRoute