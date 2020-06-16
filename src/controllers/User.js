const User = require('../models/User')

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

module.exports = {
  checkIfUserExist
}