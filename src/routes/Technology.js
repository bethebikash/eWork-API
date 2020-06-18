const express = require('express')
const router = new express.Router()
const Technology = require('../models/Technology')

// to create a technology
router.post('/technoloies', async (req, res) => {
  const technology = new Technology(req.body)
  try {
    await technology.save()
    res.status(201).json({
      status: 201,
      message: 'Technology has been added successfully.'
    })
  } catch (error) {
    throw new Error(error)
  }
})

module.exports = router