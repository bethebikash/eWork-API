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

userSchema.virtual('Users', {
  ref: 'User',
  localField: '_id',
  foreignField: 'technologies'
})

const Technology = mongoose.model('Technology', technologySchema)

module.exports = Technology