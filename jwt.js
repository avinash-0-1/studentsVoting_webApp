import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()
//generate token

const generateToken = (payload) => {
    return jwt.sign(payload, process.env.jwtkey)
}

//verification of token
const jwtMiddleware = (req, res, next) => {
    const authentication = req.headers.authorization
    if (!authentication) {
        return res.status(401).json({ message: "Unauthorized" })
    }

    const bearerToken = req.headers.authorization.split(' ')[1]
    if (!bearerToken) {
        return res.status(401).json({ message: 'Token Not Found' })
    }

    try {
        const encodedPayload = jwt.verify(bearerToken, process.env.jwtkey)
        req.user = encodedPayload
        console.log(user)
        next()
    } catch (error) {
        res.status(500).json({ message: 'server side ERROR' })
    }
}

export { generateToken , jwtMiddleware }