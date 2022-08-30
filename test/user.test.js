const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const { User } = require('../src/models/models');

const userId = new mongoose.Types.ObjectId();
const user = {
  _id: userId,
  name: 'Zhenya',
  email: 'zhenyamail@gmail.com',
  password: 'aWeSoMePaSs111!!!',
  tokens: [
    {
      token: jwt.sign({ _id: userId }, process.env.JWT_SECRET),
    },
  ],
};

beforeEach(async () => {
  await User.deleteMany({});
  await new User(user).save();
});

afterAll(() => {
  console.log('close connection');
  mongoose.connection.close();
});

describe('User test', () => {
  test('Should signup a new user', async () => {
    await request(app)
      .post('/users')
      .send({
        name: 'shell',
        email: 'supermail@gmail.com',
        password: 'superpass123!',
      })
      .expect(201);
  });

  test('Should login existing user', async () => {
    const { password, email } = user;
    const response = await request(app)
      .post('/users/login')
      .send({ email, password });

    const updatedUser = await User.findOne({ email });

    expect(response.body.token).toEqual(updatedUser.tokens[1].token);
  });

  test('Should get profile for user', async () => {
    await request(app)
      .get('/users/me')
      .set('Authorization', `Bearer ${user.tokens[0].token}`)
      .send()
      .expect(200);
  });

  test('Should delete user account', async () => {
    await request(app)
      .delete('/users/me')
      .set('Authorization', `Bearer ${user.tokens[0].token}`)
      .send()
      .expect(200);

    const deletedUser = await User.findById(userId);

    expect(deletedUser).toBeNull();
  });
});
