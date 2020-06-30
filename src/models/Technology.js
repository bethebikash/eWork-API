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

// sending only necessary data from user collection.
technologySchema.methods.toJSON = function () {
  const technology = this
  const technologyObject = technology.toObject()
  delete technologyObject.createdAt
  delete technologyObject.updatedAt
  delete technologyObject.__v
  return technologyObject
}

const Technology = mongoose.model('Technology', technologySchema)

module.exports = Technology