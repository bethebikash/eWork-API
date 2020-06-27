const mongoose = require('mongoose')

const workProfileSchema = new mongoose.Schema(
  {
    rate: {
      type: Number,
      required: true,
      trim: true
    },
    skills: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Skill'
    }],
    technologies: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Technology'
    }],
    belongs_to: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
)

// sending only necessary data from category collection.
workProfileSchema.methods.toJSON = function() {
  const workProfile = this
  const workProfileObject = workProfile.toObject()
  delete workProfileObject.createdAt
  delete workProfileObject.updatedAt
  delete workProfileObject.__v
  return workProfileObject
}

const WorkProfile = mongoose.model('WorkProfile', workProfileSchema)

module.exports = WorkProfile