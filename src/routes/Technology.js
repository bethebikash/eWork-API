const express = require('express')
const router = new express.Router()
const Technology = require('../models/Technology')
const adminAuth = require('../auth/AdminAuth')

// to create a technology
router.post('/technologies', async (req, res) => {
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

// to get all technologies
// GET /technologies?sortBy=createdAt:desc
router.get('/technologies', async (req, res) => {
  const sort = {}

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(':')
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
  }
  try {
    const technologies = await Technology.find().sort(sort)
    res.status(200).json(technologies)
  } catch (error) {
    throw new Error(error)
  }
})

// update technology by id.
router.patch(
  '/technologies/:id',
  adminAuth,
  async (req, res, next) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['technology']
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    )
    if (!isValidOperation) {
      let error = new Error('Invalid updates!')
      error.status = 400
      return next(error)
    }

    try {
      const technology = await Technology.findById(req.params.id)

      if (!technology) {
        let error = new Error('Technology not found!')
        error.status = 404
        return next(error)
      } else{
        technology.technology = req.body.technology

        await technology.save()
        res.status(200).send("Technology updated successfully")
      }
    } catch (error) {
      throw new Error(error)
    }
  }
)

// delete technology by id.
router.delete('/technologies/:id', adminAuth, async (req, res, next) => {
  try {
    const technology = await Technology.findByIdAndDelete(req.params.id)

    if (!technology) {
      let error = new Error('Technology not found!')
      error.status = 404
      return next(error)
    }
    res.send('Technology deleted successfully')
  } catch (error) {
    throw new Error(error)
  }
})

module.exports = router