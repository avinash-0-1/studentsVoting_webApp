import express from 'express';
import candidateModel from '../models/candidateSchema.js'
import userModel from '../models/userSchema.js';
import { jwtMiddleware } from '../jwt.js';
import { use } from 'react';


const candidateRoute = express.Router()

//cheacking the role of the if user if he is admin or not ?
const checkRoleForAdmin = async (userId) => {
    const user = await userModel.findById(userId)
    console.log("USER ROLE:", user.role)
    if (!user) { return false }
    return user.role === "admin";
}

//creating new candidate for election & save it into the DB
candidateRoute.post('/candidatepost', jwtMiddleware, async (req, res) => {
    try {
        const { name, party, age } = req.body; // for secure the candidates records by securing the isVoted field so that isVoted can't be manipulated

        if (!(await checkRoleForAdmin(req.user.id))) {
            return res.status(403).json({ message: "you're not the admin !!" })
        }

        const newData = new candidateModel({ name, party, age })
        const response = await newData.save()

        res.json({ response: response, message: 'new Candidate Added !' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Side ERROR" })
    }
})

candidateRoute.put('/candidateupdate:id', async (req, res) => {
    try {
        if (!(await checkRoleForAdmin(req.body.id))) {
            return res.status(403).json({ message: "you're not the admin !!" })
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
//======================================= VOTING LOGIC ==================================

candidateRoute.post('vote/candidateID', async (req, res) => {
    const candidateID = req.params.id;
    const userID = req.user.id;

    try {
        const candidate = await candidateModel.findById(candidateID)
        if (!candidate) {
            return res.status(404).json({ message: "candidate not found !" })
        }
        const user = await userModel.findById(userID)
        if (!user) {
            return res.status(404).json({ message: "user not found !" })
        }
        if (user.role == "admin") {
            return res.status(403).json({ message: "Admin are Not Allowed to vote" })
        }
        if (user.isVoted) {
            return res.status(400).json({ message: "You have already voted" })
        }

        //update candidate to record vote.
        candidate.vote.push({ user: userID })
        candidate.voteCount++;
        await candidate.save()

        //update voters record.
        user.isVoted = true;
        await user.save()

        res.status(200).json({ message: "Vote is Recorded Successfully !!" })

    } catch (error) {
        res.status(500).json({ message: "Server side ERROR" })
    }
})

//================ 

export default candidateRoute