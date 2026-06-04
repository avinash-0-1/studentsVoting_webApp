import express from 'express';
import candidateModel from '../models/candidateSchema.js'
import userModel from '../models/userSchema.js';
import { jwtMiddleware } from '../jwt.js';
import electionModel from "../models/electionSchema.js";


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

        res.json({ response: response, message: 'New Candidate Added !' })
    } catch (error) {
        console.log("creating CANDIDATE ERROR",error)
        res.status(500).json({ message: "Server Side ERROR" })
    }
})

candidateRoute.put('/candidateupdate/:id',jwtMiddleware,async (req, res) => {
    try {
        if (!(await checkRoleForAdmin(req.user.id))) {
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
        console.log("ERROR during updating the candidate" , error)
        res.status(500).json({ message: "server side ERROR" })
    }
})

candidateRoute.delete('/candidatedelete/:id',jwtMiddleware,async (req, res) => {
    try {
        if (!(await checkRoleForAdmin(req.user.id))) {
            return res.status(403).json({ message: "you'r not the admin !!" })
        }
        const id = req.params.id;
        const response = await candidateModel.findByIdAndDelete(id);
        res.status(200).json({ message: "candidate deleted !!" })
    } catch (error) {
        console.log("ERROR During Deleting the Candidate" , error)
        res.status(500).json({ message: "server side ERROR" })
    }
})
//======================================= VOTING LOGIC ==================================

candidateRoute.post('/vote/:candidateID', jwtMiddleware, async (req, res) => {
    const candidateID = req.params.candidateID;
    const userID = req.user.id;
// -------------------------------------------------------------
    const now = new Date();

    const election = await electionModel.findOne().sort({ createdAt: -1 });

    if (!election) {
        return res.status(400).json({ message: "No election configured" });
    }

    if (now < election.startTime) {
        return res.status(400).json({ message: "Election has not started yet" });
    }

    if (now > election.endTime) {
        return res.status(400).json({ message: "Election has ended" });
    }
// -------------------------------------------------------------
    try {
        const candidate = await candidateModel.findById(candidateID)
        if (!candidate) {
            return res.status(404).json({ message: "candidate not found !" })
        }
        const user = await userModel.findById(userID)
        if (!user) {
            return res.status(404).json({ message: "user not found !" })
        }
        if (user.role === "admin") {
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
        console.log("Vote post ERROR",error)
        res.status(500).json({ message: "Server side ERROR" })
    }
})

//================ vote count ======================
candidateRoute.get('/vote/count', async (req, res) => {
    try {
        const candidate = await candidateModel.find().sort({ voteCount: 'desc' })

        const voteRecord = candidate.map((data) => {
            return {
                party: data.party,
                voteCount: data.voteCount
            }
        });

        return res.status(200).json({ voteRecord: voteRecord })
    } catch (error) {
        console.log("Vote Count ERROR",error)
        res.status(500).json({ message: 'Server Side ERROR' })
    }
})
//========================= all candidate list only name and party =====================

candidateRoute.get('/', async (req, res) => {
    try {
        // Find all candidates and select only the name and party fields, excluding _id
        const candidates = await candidateModel.find();
        // console.log("THIS IS CLG DEBUG",candidates);
        res.status(200).json(candidates);
    } catch (err) {
        console.error("Candidate List ERROR",err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// ======================== Election Routes =======================================

// ================= CREATE ELECTION =================================
candidateRoute.post('/election/create', jwtMiddleware, async (req, res) => {
    try {
        if (!(await checkRoleForAdmin(req.user.id))) {
            return res.status(403).json({ message: "Only admin can set election" });
        }

        const { startTime, endTime } = req.body;

        if (!startTime || !endTime) {
            return res.status(400).json({ message: "Start and end time required" });
        }

        const newElection = new electionModel({ startTime, endTime });
        await newElection.save();

        res.json({ message: "Election created" });

    } catch (error) {
        console.log("Election create error:", error);
        res.status(500).json({ message: "Error creating election" });
    }
});

// =============================== ELECTION STATUS ============================================
candidateRoute.get('/election/status', async (req, res) => {
    try {
        const election = await electionModel.findOne().sort({ _id: -1 });

        if (!election) {
            return res.json({ isActive: false });
        }

        const now = new Date();

        const isActive =
            now >= election.startTime && now <= election.endTime;

        res.json({ isActive });

    } catch (error) {
        console.log("Election status error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// ========================== WINNER =============================================
candidateRoute.get('/winner', async (req, res) => {
  try {
    const election = await electionModel.findOne().sort({ _id: -1 });

    if (!election) {
      return res.status(400).json({ message: "No election found" });
    }

    const now = new Date();

    if (now < election.endTime) {
      return res.status(400).json({ message: "Election still ongoing" });
    }

    //find highest vote
    const topCandidate = await candidateModel
      .findOne()
      .sort({ voteCount: -1 });

    if (!topCandidate) {
      return res.status(400).json({ message: "No candidates found" });
    }

    const maxVotes = topCandidate.voteCount;

    //find ALL winners (tie support)
    const winners = await candidateModel.find({
      voteCount: maxVotes
    });

    res.json({winners});

  } catch (error) {
    console.log("Winner ERROR", error);
    res.status(500).json({ message: "Error finding winner" });
  }
});

export default candidateRoute