const Bid = require('../models/Bid')

const CheckIfBidExist = async (req, res, next) => {
  const bid = await Bid.findOne({
    bidder: req.body.bidder,
    job: req.body.job
  })

  if (bid === null) {
    next()
  } else {
    let error = new Error('You already bid for this work')
    error.status = 409
    return next(error)
  }
}

module.exports = {
  CheckIfBidExist
}
