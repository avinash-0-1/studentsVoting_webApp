import express from 'express'
import db from '../database.js'
import userModel from '../models/userSchema.js'

const route = express.Router()

route.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body
        const user = await userModel.findOne({ username: username })

        if (!username) {
            return res.send('Invalid username')
        }
        const isMatchPass = user.comparePass(password)
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

route.post('/signup', async (req, res) => {
    try {
        const data = req.body
        const newData = new userModel(data)
        const response = await newData.save()

        const payload = {
            id: response.id,
            username: response.username
        }

        const token = generateToken(payload)
        req.userPayload(token)
        res.status(200).json({ response: response, token: token })
    } catch (error) {
        res.status(500).json({ message: "Server Side ERROR" })
    }
})

route.get('profile', async (req,res) => {
    try {
        const id = req.user.id
        const response = await userModel.findById(id)
        res.json({ response })
    } catch (error) {
        res.status(500).json({ message: "server side ERROR" })
    }
})

export default route