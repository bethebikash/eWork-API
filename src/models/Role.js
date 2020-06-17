const mongoose = require('mongoose')

const roleSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      lowercase: true,
      required: true,
      trim: true
    }
  },
  {
    timestamps: true
  }
)

userSchema.virtual('Users', {
  ref: 'User',
  localField: '_id',
  foreignField: 'role'
})

const Role = mongoose.model('Role', roleSchema)

module.exports = Role