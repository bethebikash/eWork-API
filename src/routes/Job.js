const express = require('express')
const router = new express.Router()
const Job = require('../models/Job')

// to create a job
router.post('/jobs', async (req, res) => {
  const job = new Job(req.body)
  try {
    await job.save()
    res.status(201).json({
      status: 201,
      message: 'Job has been posted successfully.'
    })
  } catch (error) {
    throw new Error(error)
  }
})

module.exports = router