const express = require('express')
const router = new express.Router()
const WorkProfile = require('../models/WorkProfile')
const userController = require('../controllers/UserController')
const adminAuth = require('../auth/AdminAuth')

// to create a WorkProfile
router.post('/work-profiles', userController.checkIfWorkProfileExist, async (req, res) => {
  const workProfile = new WorkProfile(req.body)
  try {
    await workProfile.save()
    res.status(201).send('Work Profile has been created successfully')
  } catch (error) {
    throw new Error(error)
  }
})

// to get all workprofile
// GET /work-profiles?sortBy=createdAt:desc
router.get('/work-profiles', adminAuth, async (req, res) => {
  const sort = {}

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(':')
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
  }

  try {
    const workProfile = await WorkProfile.find().sort(sort)
      .populate({
        path: 'skills',
        select: '_id skill'
      })
      .populate({
        path: 'technologies',
        select: '_id, technology'
      })
      .populate({
        path: 'belongs_to',
        select: '_id, name'
      })
    res.status(200).json(workProfile)
  } catch (error) {
    throw new Error(error)
  }
})


// GET /work-profiles/belongs_to/userID  (to filter profile by user's id)
router.get('/work-profiles/belongs_to/:id', async (req, res) => {

  try {
    const workProfile = await WorkProfile.findOne({belongs_to: req.params.id})
    .populate({
      path: 'skills',
      select: '_id skill'
    })
    .populate({
      path: 'technologies',
      select: '_id, technology'
    })
    .populate({
      path: 'belongs_to',
      select: '_id, name, image'
    })
    res.status(200).json(workProfile)
  } catch (error) {
    throw new Error(error)
  }
})

// update work profile by id.
router.patch(
  '/work-profiles/:id',
  async (req, res, next) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['rate','skills','technologies']
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    )
    if (!isValidOperation) {
      let error = new Error('Invalid updates!')
      error.status = 400
      return next(error)
    }

    try {
      const workProfile = await WorkProfile.findById(req.params.id)

      if (!workProfile) {
        let error = new Error('Work Profile not found!')
        error.status = 404
        return next(error)
      } else {

        updates.forEach((update) => (workProfile[update] = req.body[update]))

        await workProfile.save()
        res.status(200).send("Work Profile updated successfully")
      }

    } catch (error) {
      throw new Error(error)
    }
  }
)

// delete work profile by id.
router.delete('/work-profiles/:id', adminAuth, async (req, res, next) => {
  try {
    const workProfile = await WorkProfile.findByIdAndDelete(req.params.id)

    if (!workProfile) {
      let error = new Error('Work Profile not found!')
      error.status = 404
      return next(error)
    }
    res.send('Work Profile deleted successfully')
  } catch (error) {
    throw new Error(error)
  }
})


module.exports = router
