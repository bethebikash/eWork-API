const express = require('express')
const router = new express.Router()
const Skill = require('../models/Skill')
const adminAuth = require('../auth/AdminAuth')


// to create a skill
router.post('/skills', async (req, res) => {
  const skill = new Skill(req.body)
  try {
    await skill.save()
    res.status(201).json({
      status: 201,
      message: 'Skill has been added successfully'
    })
  } catch (error) {
    throw new Error(error)
  }
})

// to get all skills
// GET /skills?sortBy=createdAt:desc
router.get('/skills', async (req, res) => {
  const sort = {}

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(':')
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
  }
  try {
    const skills = await Skill.find().sort(sort)
    res.status(200).json(skills)
  } catch (error) {
    throw new Error(error)
  }
})

// update skill by id.
router.patch(
  '/skills/:id',
  adminAuth,
  async (req, res, next) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['skill']
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    )
    if (!isValidOperation) {
      let error = new Error('Invalid updates!')
      error.status = 400
      return next(error)
    }

    try {
      const skill = await Skill.findById(req.params.id)

      if (!skill) {
        let error = new Error('Skill not found!')
        error.status = 404
        return next(error)
      }

      skill.skill = req.body.skill

      await skill.save()
      res.status(200).send("Skill updated successfully")
    } catch (error) {
      throw new Error(error)
    }
  }
)

// delete skill by id.
router.delete('/skills/:id', adminAuth, async (req, res, next) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id)

    if (!skill) {
      let error = new Error('Skill not found!')
      error.status = 404
      return next(error)
    }
    res.send('Skill deleted successfully')
  } catch (error) {
    throw new Error(error)
  }
})

module.exports = router