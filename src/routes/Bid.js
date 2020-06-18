const express = require('express')
const router = new express.Router()
const Bid = require('../models/Bid')

// to create a job
router.post('/bids', async (req, res) => {
  const bid = new Bid(req.body)
  try {
    await bid.save()
    res.status(201).json({
      status: 201,
      message: 'Bid has been done successfully.'
    })
  } catch (error) {
    throw new Error(error)
  }
})

module.exports = router