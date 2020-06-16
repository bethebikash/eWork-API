const express = require('express')
const router = new express.Router()
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const UserController = require('../controllers/UserController')

// to create a user // User Registation
router.post('/users', UserController.checkIfUserExist, async (req, res) => {
  const user = new User(req.body)
  try {
    await user.save()
    const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY)
    res.status(201).json({
      status: 201,
      token: token
    })
  } catch (error) {
    throw new Error(error)
  }
})

// for user login
router.post('/users/login', UserController.verifyUser, async (req, res) => {
  const user = req.user
  try {
    const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY)
    res.status(200).json({
      status: 200,
      token: token
    })
  } catch (error) {
    throw new Error(error)
  }
})

module.exports = router