const express = require('express')
const router = new express.Router()
const WorkProfile = require('../models/WorkProfile')

// to create a WorkProfile
router.post('/work-profiles', async (req, res) => {
  const workProfile = new WorkProfile(req.body)
  try {
    await workProfile.save()
    res.status(201).json({
      status: 201,
      message: 'Work Profile has been created successfully.'
    })
  } catch (error) {
    throw new Error(error)
  }
})

module.exports = router