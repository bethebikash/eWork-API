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

const WorkProfile = mongoose.model('WorkProfile', workProfileSchema)

module.exports = WorkProfile