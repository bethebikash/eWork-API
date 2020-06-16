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

const Technology = mongoose.model('Technology', technologySchema)

module.exports = Technology