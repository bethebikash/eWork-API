const express = require('express')
const router = new express.Router()
const Skill = require('../models/Skill')

// to create a job
router.post('/skills', async (req, res) => {
  const skill = new Skill(req.body)
  try {
    await skill.save()
    res.status(201).json({
      status: 201,
      message: 'Skill has been added successfully.'
    })
  } catch (error) {
    throw new Error(error)
  }
})

module.exports = router