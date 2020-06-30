const express = require('express')
const router = new express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const userAuth = require('../auth/UserAuth')
const adminAuth = require('../auth/AdminAuth')
const UserController = require('../controllers/UserController')

// to create a user
router.post('/users', adminAuth, UserController.checkIfUserExist, async (req, res) => {
  const user = new User(req.body)
  try {
    await user.save()
    res.status(201).send("User created successfully")
  } catch (error) {
    throw new Error(error)
  }
})

// for user egistation
router.post('/users/register', UserController.checkIfUserExist, async (req, res) => {
  const user = new User(req.body)
  try {
    await user.save()
    const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY)
    res.status(201).json({
      status: 201,
      token: token,
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
      token: token,
    })
  } catch (error) {
    throw new Error(error)
  }
})

// to get all the users
// GET /users?sortBy=createdAt:desc
// GET /users?role=admin  (to filter users by role)
router.get('/users', adminAuth, async (req, res) => {
  const sort = {}
  const match = {}

  if (req.query.role) {
    match.role = req.query.role
  }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(':')
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
  }

  try {
    const users = await User.find(match).sort(sort)
    res.status(200).json(users)
  } catch (error) {
    throw new Error(error)
  }
})

// update user by id.
router.patch('/users/:id', adminAuth, async (req, res, next) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['name', 'email', 'address', 'phone', 'password', 'username']
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' })
  }

  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      let error = new Error('User not found!')
      error.status = 404
      return next(error)
    } else{

      updates.forEach((update) => (user[update] = req.body[update]))
      
      await user.save()
      res.status(200).json("User updated successfully")
    }

  } catch (error) {
    throw new Error(error)
  }
})

// delete user by id.
router.delete('/users/:id', adminAuth, async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)
    // await Booking.deleteMany({ user: req.params.id })
    // await Review.deleteMany({ user: req.params.id })

    if (!user) {
      let error = new Error('User not found!')
      error.status = 404
      return next(error)
    }
    res.status(200).send('User deleted successfully')
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
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
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
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
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
