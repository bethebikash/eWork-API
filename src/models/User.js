const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const { Binary } = require('mongodb')

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      minlength: 6,
      lowercase: true,
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
      },
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 6,
    },
    image: {
      type: String,
      default: null
    },
    role: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  }
)

userSchema.virtual('WorkProfiles', {
  ref: 'WorkProfile',
  localField: '_id',
  foreignField: 'belongs_to'
})

userSchema.virtual('Jobs', {
  ref: 'Job',
  localField: '_id',
  foreignField: 'posted_by',
})

userSchema.virtual('Jobs', {
  ref: 'Job',
  localField: '_id',
  foreignField: 'taken_by',
})

userSchema.virtual('Bids', {
  ref: 'Bid',
  localField: '_id',
  foreignField: 'bidder',
})

// sending only necessary data from user collection.
userSchema.methods.toJSON = function () {
  const user = this
  const userObject = user.toObject()
  delete userObject.password
  delete userObject.createdAt
  delete userObject.updatedAt
  delete userObject.__v
  return userObject
}

// Hashing the plain text password before saving.
userSchema.pre('save', async function (next) {
  const user = this
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }
  next()
})

const User = mongoose.model('User', userSchema)

module.exports = User
