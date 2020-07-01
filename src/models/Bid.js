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

// sending only necessary data from user collection.
bidSchema.methods.toJSON = function () {
  const bid = this
  const bidObject = bid.toObject()
  delete bidObject.createdAt
  delete bidObject.updatedAt
  delete bidObject.__v
  return bidObject
}

const Bid = mongoose.model('Bid', bidSchema)

module.exports = Bid