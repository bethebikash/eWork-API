const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      minlength: 6,
      lowercase: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Email is invalid!')
        }
      }
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    address: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 6
    },
    image: {
      type: String,
      default: ''
    },
    role: {
      type: String,
      default: ''
    },
    skills: {
      type: String,
      default: ''
    },
    technology: {
      type: String,
      default: ''
    },
    paymentProfile: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
)

// Hashing the plain text password before saving.
userSchema.pre('save', async function(next) {
  const user = this
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }
  next()
})

const User = mongoose.model('User', userSchema)

module.exports = User