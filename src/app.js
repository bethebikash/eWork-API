const express = require('express')
const path = require('path')
require('./db/DbConfig')
require('dotenv').config();
const cors = require('cors')
const adminRouter = require('./routes/Admin')
const userRouter = require('./routes/User')
const skillRouter = require('./routes/Skill')
const technologyRouter = require('./routes/Technology')
const workProfileRouter = require('./routes/WorkProfile')
const jobRouter = require('./routes/Job')
const bidRouter = require('./routes/Bid')

const app = express()
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use('/public', express.static('public'))

// Ruoters
app.use(adminRouter)
app.use(userRouter)
app.use(skillRouter)
app.use(technologyRouter)
app.use(workProfileRouter)
app.use(jobRouter)
app.use(bidRouter)

app.get('/', (req, res) => {
  try {
    res.status(200).sendFile(path.join(__dirname + '/..//public/index.html'));
  } catch (error) {
    throw new Error(error)
  }
})

app.use((error, req, res, next) => {
  console.error(error.stack)
  res.status(error.status || 500)
  res.json({
    error: {
      status: error.status || 500,
      message: error.message
    }
  })
})

module.exports = app