const Admin = require('../models/Admin')
const bcrypt = require('bcryptjs')

const verifyAdmin = async (req, res, next) => {
  const admin = await Admin.findOne({ username: req.body.username })
  if (!admin) {
    let error = new Error('Unauthorized')
    error.status = 401
    return next(error)
  }

  const isMatch = await bcrypt.compare(req.body.password, admin.password)

  if (!isMatch) {
    let error = new Error('Unauthorized')
    error.status = 401
    return next(error)
  } else {
    req.admin = admin
    next()
  }
}

module.exports = {
  verifyAdmin
}
