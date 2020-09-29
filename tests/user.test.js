const request = require('supertest')
const app = require('../src/app')
const {
  adminToken,
  userOne,
  userOneId,
  userOneToken,
  setUpDB
} = require('./initDB')

beforeEach(setUpDB)

test('Should register a user', async () => {
  await request(app)
    .post('/users/register')
    .send({
      name: 'Test Name',
      email: 'test@gmail.com',
      address: 'Koteshwor, Ktm',
      phone: '9800000000',
      username: 'test123',
      password: 'test123',
      role: 'hire'
    })
    .expect(201)
})

test('Should login the user', async () => {
  await request(app)
    .post('/users/login')
    .send({
      username: userOne.username,
      password: userOne.password
    })
    .expect(200)
})

test('Should get all the users', async () => {
  const response = await request(app)
    .get('/users')
    .set('Authorization', `Bearer ${adminToken}`)
    .expect(200)

  expect(response.body).not.toBeNull()
})

test('Should get user profile', async () => {
  await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userOneToken}`)
    .expect(200)
})

test('Should update user by admin', async () => {
  const response = await request(app)
    .patch(`/users/${userOneId}`)
    .send({
      address: 'Updated Address, Admin'
    })
    .set('Authorization', `Bearer ${adminToken}`)
    .expect(200)
})

test('Should update user profile by user', async () => {
  const response = await request(app)
    .put('/users/me')
    .send({
      name: 'Update Bhattarai',
      phone: '984900000'
    })
    .set('Authorization', `Bearer ${userOneToken}`)
    .expect(200)
  expect(response.body.name).toBe('Update Bhattarai')
})

test('Should change password by user', async () => {
  await request(app)
    .patch('/users/me/change-password')
    .send({
      oldpassword: 'Bikash123',
      newpassword: 'admin123'
    })
    .set('Authorization', `Bearer ${userOneToken}`)
    .expect(200)
})
