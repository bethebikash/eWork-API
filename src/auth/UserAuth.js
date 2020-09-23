const jwt = require('jsonwebtoken')
const User = require('../models/User')

const userAuth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization')
    if (!authHeader) {
      throw new Error('Bearer token is not set!')
    }
    const token = authHeader.slice(7, authHeader.length)

    const decoded = jwt.verify(token, process.env.SECRET_KEY)

    const user = await User.findById(decoded._id)

    if (!user) {
      throw new Error()
    }
    req.token = token
    req.user = user
    next()
  } catch (err) {
    console.log(err)
    let error = new Error('Unauthorized')
    error.status = 401
    return next(error)
  }
}

module.exports = userAuth
