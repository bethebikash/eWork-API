const mongoose = require('mongoose')

const skillSchema = new mongoose.Schema(
  {
    skill: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
)

skillSchema.virtual('WorkProfiles', {
  ref: 'WorkProfile',
  localField: '_id',
  foreignField: 'skills'
})

// sending only necessary data from user collection.
skillSchema.methods.toJSON = function () {
  const skill = this
  const skillObject = skill.toObject()
  delete skillObject.createdAt
  delete skillObject.updatedAt
  delete skillObject.__v
  return skillObject
}

const Skill = mongoose.model('Skill', skillSchema)

module.exports = Skill