import express from 'express';
import candidateModel from '../models/candidateSchema.js'

const candidateRoute = express.Router()

//cheacking the role of the if user if he is admin or not ?
const checkRoleForAdmin = async (userId) => {
    const candidate = await candidateModel.findById(userId)
    const temp = candidate.role === "admin" ? true : false
    return temp
}

//creating new candidate for election & save it into the DB
candidateRoute.post('/candidatepost', async (req, res) => {
    try {
        if (!(await checkRoleForAdmin(req.body.id))) {
            return res.status(403).json({ message: "you'r not the admin !!" })
        }
        const data = req.body
        const newData = new candidateModel(data)
        const response = await newData.save()
        res.json({ message: 'updated!' })
    } catch (error) {
        res.status(500).json({ message: "Server Side ERROR" })
    }
})

candidateRoute.put('/candidateupdate:id', async (req, res) => {
    try {
        if (!(await checkRoleForAdmin(req.body.id))) {
            return res.status(403).json({ message: "you'r not the admin !!" })
        }

        const id = req.params.id;
        const data = req.body;

        const response = await candidateModel.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        })

        if (!response) {
            return res.status(401).json({ message: "persone not found !!" })
        }

        res.status(200).json({ response: response })
    } catch (error) {
        res.status(500).json({ message: "server side ERROR" })
    }
})

candidateRoute.delete('/candidatedelete:id', async (req, res) => {
    try {
        if (!(await checkRoleForAdmin(req.body.id))) {
            return res.status(403).json({ message: "you'r not the admin !!" })
        }
        const id = req.params.id;
        const response = await candidateModel.findByIdAndDelete(id);
        res.status(200).json({ message: "candidate deleted !!" })
    } catch (error) {
        res.status(500).json({ message: "server side ERROR" })
    }
})


export default candidateRoute