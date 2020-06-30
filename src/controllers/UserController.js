const User = require('../models/User')
const bcrypt = require('bcryptjs')
const WorkProfile = require('../models/WorkProfile')

const checkIfUserExist = async (req, res, next) => {
  const user = await User.findOne({
    email: req.body.email
  })
  if (user === null) {
    const user = await User.findOne({
      username: req.body.username
    })
    if (user === null) {
      next()
    } else {
      let error = new Error('Username is taken')
      error.status = 409
      return next(error)
    }
  } else {
    let error = new Error('User already exist with this email')
    error.status = 409
    return next(error)
  }
}

const verifyUser = async (req, res, next) => {
  const user = await User.findOne({ username: req.body.username })
  if (!user) {
    let error = new Error('User not found')
    error.status = 400
    return next(error)
  } else {
    const isMatch = await bcrypt.compare(req.body.password, user.password)

    if (!isMatch) {
      let error = new Error('Incorrect password')
      error.status = 403
      return next(error)
    } else {
      req.user = user
      next()
    }
  }
}

const checkIfWorkProfileExist = async (req, res, next) => {
  const workProfile = await WorkProfile.findOne({
    belongs_to: req.body.belongs_to
  })
  if (workProfile === null) {
    next()
  } else {
    let error = new Error('Work Profile is already added')
    error.status = 409
    return next(error)
  }
}

module.exports = {
  checkIfUserExist,
  verifyUser,
  checkIfWorkProfileExist,
}
