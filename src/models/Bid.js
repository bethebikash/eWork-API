const mongoose = require('mongoose')

const bidSchema = new mongoose.Schema(
  {
    bidder: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Job',
    }
  },
  {
    timestamps: true
  }
)

const Bid = mongoose.model('Bid', bidSchema)

module.exports = Bid