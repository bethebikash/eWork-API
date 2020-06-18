const mongoose = require('mongoose')

const technologySchema = new mongoose.Schema(
  {
    technology: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
)

technologySchema.virtual('WorkProfiles', {
  ref: 'WorkProfile',
  localField: '_id',
  foreignField: 'skills'
})

const Technology = mongoose.model('Technology', technologySchema)

module.exports = Technology