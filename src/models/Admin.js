const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const adminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      minlength: 5,
      lowercase: true
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 5
    }
  },
  {
    timestamps: true
  }
)

// sending only necessary data from admin collection.
adminSchema.methods.toJSON = function() {
  const admin = this
  const adminObject = admin.toObject()
  delete adminObject.password
  delete adminObject.createdAt
  delete adminObject.updatedAt
  delete adminObject.__v
  return adminObject
}

// Hashing the plain text password before saving.
adminSchema.pre('save', async function(next) {
  const admin = this
  admin.password = await bcrypt.hash(admin.password, 8)
  next()
})

const Admin = mongoose.model('Admin', adminSchema)

module.exports = Admin
