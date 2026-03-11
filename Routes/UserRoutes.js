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





export default route