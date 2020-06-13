const mongoose = require('mongoose')
require('dotenv').config();

mongoose
    .connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(db => {
        console.log('Successfully connected to MongodB server')
    })
    .catch(err => {
        console.log(err)
    })