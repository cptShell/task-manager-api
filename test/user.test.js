const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');

afterAll(() => {
  mongoose.connection.close();
});

describe('User test', () => {
  test('Should signup a new user', async () => {
    const response = await request(app).post('/users').send({
      name: 'shell',
      email: 'supermail@gmail.com',
      password: 'superpass123!',
    });

    expect(response.statusCode).toEqual(201);
  });
});
