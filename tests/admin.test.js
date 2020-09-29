const request = require('supertest')
const app = require('../src/app')

test('Should Login the admin', async()=>{
  await request(app).post('/admin').send({
    username: 'admin',
    password: 'admin'
  }).expect(200)
})

test('Should denie the admin', async()=>{
  await request(app).post('/admin').send({
    username: 'admin',
    password: 'password'
  }).expect(401)
})
