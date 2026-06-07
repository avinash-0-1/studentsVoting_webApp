import express from 'express'
import userModel from '../models/userSchema.js'
import { jwtMiddleware, generateToken } from '../jwt.js'

const userRoute = express.Router()

userRoute.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body

        if (!username || !password) {
            return res.status(400).json({ message: "Please Enter Username And Password !" })
        }

        const user = await userModel.findOne({ username: username })

        if (!user) {
            return res.status(401).json({ message: 'Invalid username' })
        }
        const isMatchPass = await user.comparePassword(password)
        if (!isMatchPass) {
            return res.status(401).json({ message: 'Invalid Password' })
        }

        const payload = {
            id: user._id,
            username: user.username,
            role: user.role
        }

        const token = generateToken(payload)
        res.status(200).json({
            token,
            role: user.role,
            firstLogin: user.firstLogin
        })
    } catch (error) {
        console.log("LOGIN ERROR", error);
        res.status(500).json({ message: 'Server Side ERROR' })
    }

})

userRoute.post('/signup', async (req, res) => {
    try {
        const data = req.body
        data.role = "voter";
        const newData = new userModel(data)
        const response = await newData.save()

        const payload = {
            id: response._id,
        }

        const token = generateToken(payload)

        res.status(200).json({ response: response, token: token })
    } catch (error) {
        console.log("SIGNUP ERROR", error)
        res.status(500).json({ message: "Server Side ERROR" })
    }
})

userRoute.get('/profile', jwtMiddleware, async (req, res) => {
    try {
        const id = req.user.id
        const response = await userModel.findById(id)
        res.json({ response })
    } catch (error) {
        console.log("PROFILE ERROR", error)
        res.status(500).json({ message: "server side ERROR" })
    }
})

userRoute.put('/profile/passwordupdate', jwtMiddleware, async (req, res) => {
    try {
        const userId = req.user.id   // ye "req.user.id" JWT ka token verification wala 'user' hai..!! 
        const { currentpassword, newpassword } = req.body
        const user = await userModel.findById(userId)
        const isMatchPass = await user.comparePassword(currentpassword)
        if (!isMatchPass) {
            return res.status(401).json({ message: "Invalid Password" })
        }
        user.password = newpassword
        await user.save()
        res.status(200).json({ message: "Password Updated" })
    } catch (error) {
        console.log("PROFILE PASS-UPDATE ERROR", error)
        res.status(500).json({ message: 'Server side ERROR' })
    }
})

// ------------------------------------- Admin ----------------------------------------------------

userRoute.put("/admin/setup",jwtMiddleware,async (req, res) => {
        try {
            const { username, password } = req.body;
            const admin = await userModel.findById(req.user.id);

            if (!admin) {
                return res.status(404).json({
                    message: "Admin not found"
                });
            }

            admin.username = username;
            admin.password = password;
            admin.firstLogin = false;

            await admin.save();

            res.status(200).json({
                message: "Admin credentials updated"
            });

        } catch (error) {

            console.log(error);

            res.status(500).json({
                message: "Server Error"
            });
        }
    }
);

export default userRoute