const express = require('express')
const router = new express.Router()
const multer = require('multer')
const path = require('path')
const Job = require('../models/Job')

// to create a job
router.post('/jobs', async (req, res) => {
  const job = new Job(req.body)
  try {
    await job.save()
    res.status(201).send('Job has been posted successfully')
  } catch (error) {
    throw new Error(error)
  }
})

// to get all services
// GET /jobs?sortBy=createdAt:desc
// GET /jobs?status= available  (to filter jobs by status)
router.get('/jobs', async (req, res) => {
  const sort = {}
  const match = {}

  if (req.query.status) {
    match.status = req.query.status
  }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(':')
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
  }

  try {
    const jobs = await Job.find(match)
      .sort(sort)
      .populate({
        path: 'posted_by',
        select: '_id, name'
      })
      .populate({
        path: 'taken_by',
        select: '_id, name'
      })
    res.status(200).json(jobs)
  } catch (error) {
    throw new Error(error)
  }
})

// to get job by id
router.get('/jobs/:id', async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate({
        path: 'posted_by',
        select: '_id, name'
      })
      .populate({
        path: 'taken_by',
        select: '_id, name'
      })
    if (!job) {
      let error = new Error('Job not found!')
      error.status = 404
      return next(error)
    }
    res.status(200).json(job)
  } catch (error) {
    throw new Error(error)
  }
})

// update job by id.
router.patch(
  '/jobs/:id',
  async (req, res, next) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['title','description','status','taken_by']
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    )
    if (!isValidOperation) {
      let error = new Error('Invalid updates!')
      error.status = 400
      return next(error)
    }

    try {
      const job = await Job.findById(req.params.id)

      if (!job) {
        let error = new Error('Job not found!')
        error.status = 404
        return next(error)
      } else {

        updates.forEach((update) => (job[update] = req.body[update]))

        await job.save()
        res.status(200).send("Job updated successfully")
      }

    } catch (error) {
      throw new Error(error)
    }
  }
)

// job file upload
const storage = multer.diskStorage({
  destination: './public/uploads',
  filename: (req, file, callback) => {
    let ext = path.extname(file.originalname)
    callback(null, `${file.fieldname}-${Date.now()}${ext}`)
  }
})

const jobFileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(zip|rar)$/)) {
    return cb(new Error('Please provide an Zip or RAR file.'), false)
  } else if (req.body.name) {
  }
  cb(null, true)
}

const upload = multer({
  storage: storage,
  fileFilter: jobFileFilter
})

router.patch(
  '/jobs/upload/:id',
  upload.single('jobFile'),
  async (req, res) => {
    try {
      const job = await Job.findById(req.params.id)

      if (!job) {
        let error = new Error('Job not found!')
        error.status = 404
        return next(error)
      } else {
      console.log(req.file)

        job.file = req.file.path
        await job.save()
        res.status(200).send("File Uploded Successfully")
      }
    } catch (error) {
      throw new Error(error)
    }
  }
)

// delete skill by id.
router.delete('/jobs/:id', async (req, res, next) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id)

    if (!job) {
      let error = new Error('Job not found!')
      error.status = 404
      return next(error)
    }
    
    res.send('Job deleted successfully')
  } catch (error) {
    throw new Error(error)
  }
})

module.exports = router
