const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../src/models/User')

const adminToken = jwt.sign(
  { _id: '5f735c868ce95c2f306a81ba' },
  process.env.SECRET_KEY
)

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
  _id: userOneId,
  name: 'Biaksh Bhattarai',
  email: 'bikash@gmail.com',
  address: 'Koteshwor, Ktm',
  phone: '9849940443',
  username: 'bikash123',
  password: 'Bikash123',
  role: 'work'
}

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
  _id: userTwoId,
  name: 'Harka Karki',
  email: 'harka@gmail.com',
  address: 'Banepa, Ktm',
  phone: '98081465458',
  username: 'harka123',
  password: 'harka123',
  role: 'work'
}

const setUpDB = async () => {
  await User.deleteMany()
  await new User(userOne).save()
  await new User(userTwo).save()
}

const userOneToken = jwt.sign({ _id: userOneId }, process.env.SECRET_KEY)
const userTwoToken = jwt.sign({ _id: userTwoId }, process.env.SECRET_KEY)

module.exports = {
  adminToken,
  userOne,
  userOneId,
  userOneToken,
  userTwo,
  userTwoId,
  userTwoToken,
  setUpDB
}
