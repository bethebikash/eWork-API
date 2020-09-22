const mongoose = require('mongoose')

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: 'available'
    },
    file: {
      type: String,
      default: ''
    },
    posted_by: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    taken_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
  },
  {
    timestamps: true,
  }
)

jobSchema.virtual('Bids', {
  ref: 'Bid',
  localField: '_id',
  foreignField: 'job'
})

// sending only necessary data from user collection.
jobSchema.methods.toJSON = function () {
  const job = this
  const jobObject = job.toObject()
  delete jobObject.updatedAt
  delete jobObject.__v
  return jobObject
}

const Job = mongoose.model('Job', jobSchema)

module.exports = Job
