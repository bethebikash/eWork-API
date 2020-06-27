const express = require('express')
const router = new express.Router()
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const userAuth = require('../auth/UserAuth')
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

// to get all the users
// GET /users?sortBy=createdAt:desc
router.get('/users', async (req, res) => {
  const sort = {}

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(':')
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
  }

  try {
    const users = await User.find().sort(sort)
    res.status(200).json(users)
  } catch (error) {
    throw new Error(error)
  }
})

// to get user profile
router.get('/users/me', userAuth, async (req, res) => {
  res.status(200).send(req.user)
})

// to update user profile
router.put('/users/me', userAuth, async (req, res, next) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['name', 'email', 'address', 'phone', 'username']
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  )
  if (!isValidOperation) {
    let error = new Error('Invalid updates!')
    error.status = 400
    return next(error)
  }

  try {
    updates.forEach((update) => (req.user[update] = req.body[update]))

    await req.user.save()
    res.send(req.user)
  } catch (error) {
    throw new Error(error)
  }
})

// to update user password
router.patch('/users/me/change-password', userAuth, async (req, res, next) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['oldpassword', 'newpassword']
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  )
  if (!isValidOperation) {
    let error = new Error('Invalid updates!')
    error.status = 400
    return next(error)
  }

  const isMatch = await bcrypt.compare(req.body.oldpassword, req.user.password)

  if (!isMatch) {
    let error = new Error('Your old password does not match')
    error.status = 400
    return next(error)
  }

  try {
    req.user.password = req.body.newpassword

    await req.user.save()
    res.status(200).send('Password has been changed successfully')
  } catch (error) {
    throw new Error(error)
  }
})

module.exports = router