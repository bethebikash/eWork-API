const express = require('express')
require('./db/DbConfig')
require('dotenv').config();
const cors = require('cors')
const morgan = require('morgan')
const userRouter = require('./routes/User')
const jobRouter = require('./routes/Job')
const bidRouter = require('./routes/Bid')

const app = express()
app.use(express.json())
app.use(morgan('dev'))
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use('/public', express.static('public'))

// Ruoters
app.use(userRouter)
app.use(jobRouter)
app.use(bidRouter)

app.use((error, req, res, next) => {
  console.error(error.stack)
  res.status(error.status || 500)
  res.json({
    error: {
      status: error.status || 500,
      error: error.message
    }
  })
})

module.exports = app