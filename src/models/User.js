const mongoose = require('mongoose')
const validator = require('validator')

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

const User = mongoose.model('User', userSchema)

module.exports = User