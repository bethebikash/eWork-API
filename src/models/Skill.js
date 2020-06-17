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

userSchema.virtual('Users', {
  ref: 'User',
  localField: '_id',
  foreignField: 'skills'
})

const Skill = mongoose.model('Skill', skillSchema)

module.exports = Skill