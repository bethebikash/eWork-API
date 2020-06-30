const jwt = require('jsonwebtoken')
const Admin = require('../models/Admin')

const adminAuth = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization')
        if (!authHeader) {
            throw new Error('Bearer token is not set!')
        }
        const token = authHeader.slice(7, authHeader.length)

        const decoded = jwt.verify(token, process.env.SECRET_KEY)

        const admin = await Admin.findById(decoded._id)

        if (!admin) {
            throw new Error()
        }
        req.token = token
        req.admin = admin
        next()
    } catch (error) {
        res.status(401).send({ status: 401, error: 'Unauthorized' })
        console.log(error)
    }
}

module.exports = adminAuth
