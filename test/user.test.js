const request = require('supertest');
const app = require('../src/app');
const { User } = require('../src/models/models');
const {
  user,
  userId,
  setupDatabase,
  closeConnection,
} = require('./fixtures/db');

beforeEach(setupDatabase);
afterAll(closeConnection);

describe('Positive user tests', () => {
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

  test('Should upload avatar image', async () => {
    await request(app)
      .post('/users/me/avatar')
      .set('Authorization', `Bearer ${user.tokens[0].token}`)
      .attach('avatar', 'test/fixtures/zhenya3.jpg');

    const updatedUser = await User.findById(userId);

    expect(updatedUser.avatar).toEqual(expect.any(Buffer));
  });

  test('Should update valid user fields', async () => {
    await request(app)
      .patch('/users/me')
      .set('Authorization', `Bearer ${user.tokens[0].token}`)
      .send({ name: 'superShell' })
      .expect(200);
  });
});

describe('Negative user tests', () => {
  test('Should not signup user with invalid name', async () => {
    const invalidNameUser = { ...user, name: 123 };
    await request(app).post('/users').send(invalidNameUser).expect(400);
  });

  test('Should not signup user with invalid password', async () => {
    const invalidPasswordUser = { ...user, password: 'short' };
    await request(app).post('/users').send(invalidPasswordUser).expect(400);
  });

  test('Should not signup user with invalid email', async () => {
    const invalidEmailUser = { ...user, email: 'icorrectEmail' };
    await request(app).post('/users').send(invalidEmailUser).expect(400);
  });

  test('Should not update user if unauthenticated', async () => {
    await request(app)
      .patch('/users/me')
      .set('Authorization', 'Bearer incorrectToken')
      .send({ description: 'this description should not apply' })
      .expect(401);
  });

  test('Should not update invalid user name', async () => {
    await request(app)
      .patch('/users/me')
      .set('Authorization', `Bearer ${user.tokens[0].token}`)
      .send({ name: 123 })
      .expect(400);
  });

  test('Should not update invalid user password', async () => {
    await request(app)
      .patch('/users/me')
      .set('Authorization', `Bearer ${user.tokens[0].token}`)
      .send({ password: 'short' })
      .expect(400);
  });

  test('Should not update invalid user email', async () => {
    await request(app)
      .patch('/users/me')
      .set('Authorization', `Bearer ${user.tokens[0].token}`)
      .send({ email: 'notemail' })
      .expect(400);
  });

  test('Should not delete user if unauthenticated', async () => {
    await request(app)
      .delete('/users/me')
      .set('Authorization', 'Bearer icorrecttoken')
      .send()
      .expect(401);
  });
});
