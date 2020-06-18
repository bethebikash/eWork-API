const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema(
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

const User = mongoose.model('User', userSchema)

module.exports = User