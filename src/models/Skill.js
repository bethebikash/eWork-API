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

const Skill = mongoose.model('Skill', skillSchema)

module.exports = Skill