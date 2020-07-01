const express = require('express')
const router = new express.Router()
const Bid = require('../models/Bid')
const Job = require('../models/Job')
const { CheckIfBidExist } = require('../controllers/bidController')
CheckIfBidExist

// to create a job
router.post('/bids', CheckIfBidExist, async (req, res) => {
  const bid = new Bid(req.body)
  try {
    await bid.save()
    res.status(201).json({
      status: 201,
      message: 'Bid has been done successfully.',
    })
  } catch (error) {
    throw new Error(error)
  }
})

// to get all bids
// GET /bids?sortBy=createdAt:desc
// GET /bids?bidder= user_id  (to filter bids by user)
// GET /bids?job= job_id (to filter bids by job)
router.get('/bids', async (req, res) => {
  const sort = {}
  const match = {}

  if (req.query.bidder) {
    match.bidder = req.query.bidder
  } else if (req.query.job) {
    match.job = req.query.job
  }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(':')
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
  }

  try {
    const bids = await Bid.find(match)
      .sort(sort)
      .populate({
        path: 'bidder',
        select: '_id, name'
      })
      .populate({
        path: 'job',
        select: '_id, title'
      })
    res.status(200).json(bids)
  } catch (error) {
    throw new Error(error)
  }
})

// choose a bidder
router.post(
  '/bids/choose',
  async (req, res, next) => {
    try {
      const job = await Job.findById(req.body.job)

      if(!job){
        let error = new Error('Job not found!')
        error.status = 404
        return next(error)
      } else {
        job.status = 'taken'
        job.taken_by = req.body.bidder
        job.save()

        const bids = await Bid.deleteMany({job: req.body.job})

        if(!bids){
          let error = new Error('Bids not found!')
          error.status = 404
          return next(error)
        }

        res.send('Bidder has been choosen to take your job')
      }
    } catch (error) {
      throw new Error(error)
    }
  }
)

// delete bid by id.
router.delete('/bids/:id', async (req, res, next) => {
  try {
    const bid = await Bid.findByIdAndDelete(req.params.id)

    if (!bid) {
      let error = new Error('Bid not found!')
      error.status = 404
      return next(error)
    }
    
    res.send('Bid deleted successfully')
  } catch (error) {
    throw new Error(error)
  }
})

module.exports = router
