const express = require('express')
require('dotenv').config();
const cors = require('cors')
const morgan = require('morgan')

const app = express()
app.use(express.json())
app.use(morgan('dev'))
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use('/public', express.static('public'))

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