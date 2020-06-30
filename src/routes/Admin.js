const express = require('express')
const router = new express.Router()
const jwt = require('jsonwebtoken')
const AdminController = require('../controllers/AdminController')

// for admin login
router.post('/admin', AdminController.verifyAdmin, async (req, res) => {
  const admin = req.admin
  try {
      const token = jwt.sign({ _id: admin._id }, process.env.SECRET_KEY)
      res.status(200).json({
          status: 200,
          token: token
      })
  } catch (error) {
      throw new Error(error)
  }
})

module.exports = router