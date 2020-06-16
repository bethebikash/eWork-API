const express = require('express')
const router = new express.Router()
const User = require('../models/User')
const UserController = require('../controllers/User')

// to create a user
router.post('/users', UserController.checkIfUserExist, async (req, res) => {
  const user = new User(req.body)
  try {
    await user.save()
    res.status(201).send(user)
  } catch (error) {
    throw new Error(error)
  }
})

module.exports = router