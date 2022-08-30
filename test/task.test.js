const request = require('supertest');
const app = require('../src/app');
const { Task } = require('../src/models/models');
const {
  user,
  setupDatabase,
  closeConnection,
  thirdTask,
} = require('./fixtures/db');

beforeEach(setupDatabase);
afterAll(closeConnection);

describe('Task test', () => {
  test('Should create task for user', async () => {
    const response = await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${user.tokens[0].token}`)
      .send({ description: 'Test task' })
      .expect(201);

    const task = await Task.findById(response.body._id);
    expect(task).not.toBeNull();
    expect(task.completed).toEqual(false);
  });

  test('Should display all users tasks', async () => {
    const response = await request(app)
      .get('/tasks')
      .set('Authorization', `Bearer ${user.tokens[0].token}`)
      .send()
      .expect(200);

    const tasks = response.body;
    expect(tasks.length).toEqual(2);
  });

  test('Should protect task from deleting by another user', async () => {
    await request(app)
      .delete(`/tasks/${thirdTask._id}`)
      .set('Authorization', `Bearer ${user.tokens[0].token}`)
      .send()
      .expect(404);

    const task = await Task.findById(thirdTask._id);
    expect(task).not.toBeNull();
  });
});
