const request = require('supertest');
const app = require('../src/app');
const { Task } = require('../src/models/models');
const {
  user,
  anotherOneUser,
  setupDatabase,
  closeConnection,
  thirdTask,
  firstTask,
  secondTask,
} = require('./fixtures/db');

beforeEach(setupDatabase);
afterAll(closeConnection);

describe('Positive task test', () => {
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

  test('Should delete user task', async () => {
    await request(app)
      .delete(`/tasks/${firstTask._id}`)
      .set('Authorization', `Bearer ${user.tokens[0].token}`)
      .send()
      .expect(200);
  });

  test('Should fetch user task by id', async () => {
    await request(app)
      .get(`/tasks/${secondTask._id}`)
      .set('Authorization', `Bearer ${user.tokens[0].token}`)
      .expect(200);
  });

  test('Should fetch only completed tasks', async () => {
    const response = await request(app)
      .get(`/tasks?completed=true`)
      .set('Authorization', `Bearer ${anotherOneUser.tokens[0].token}`)
      .send();

    expect(response.body.length).toEqual(2);
  });

  test('Should fetch only incomplete tasks', async () => {
    const response = await request(app)
      .get(`/tasks?completed=false`)
      .set('Authorization', `Bearer ${anotherOneUser.tokens[0].token}`)
      .send();

    expect(response.body.length).toEqual(2);
  });

  test('Should fetch page of tasks', async () => {
    const response = await request(app)
      .get(`/tasks?limit=3&page=2`)
      .set('Authorization', `Bearer ${anotherOneUser.tokens[0].token}`)
      .send();

    console.log(response.body);

    expect(response.body.length).toEqual(1);
  });
});

describe('Negative task test', () => {
  const invalidTasks = [
    { description: [1], completed: true },
    { description: 'New description', completed: 12345 },
  ];

  test('Should not create task with invalid description', async () => {
    await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${user.tokens[0].token}`)
      .send(invalidTasks[0])
      .expect(400);
  });

  test('Should not create task with invalid completed value', async () => {
    await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${user.tokens[0].token}`)
      .send(invalidTasks[1])
      .expect(400);
  });

  test('Should not update task with invalid description', async () => {
    await request(app)
      .patch(`/tasks/${firstTask._id}`)
      .set('Authorization', `Bearer ${user.tokens[0].token}`)
      .send({ description: { name: 'Zhenya' } })
      .expect(400);
  });

  test('Should not update task with invalid completed value', async () => {
    await request(app)
      .patch(`/tasks/${firstTask._id}`)
      .set('Authorization', `Bearer ${user.tokens[0].token}`)
      .send({ completed: 12345 })
      .expect(400);
  });

  test('Should not delete task if unauthenticated', async () => {
    await request(app)
      .delete(`/tasks/${thirdTask._id}`)
      .set('Authorization', `Bearer sometoken123`)
      .send()
      .expect(401);
  });

  test('Should not update other users task', async () => {
    await request(app)
      .patch(`/tasks/${thirdTask._id}`)
      .set('Authorization', `Bearer ${user.tokens[0].token}`)
      .send({ completed: true })
      .expect(404);
  });

  test('Should not fetch user task by id if unauthenticated', async () => {
    await request(app)
      .get(`/tasks/${secondTask._id}`)
      .set('Authorization', `Bearer asasdasd124`)
      .send()
      .expect(401);
  });

  test('Should not fetch other users task by id', async () => {
    await request(app)
      .get(`/tasks/${thirdTask._id}`)
      .set('Authorization', `Bearer ${user.tokens[0].token}`)
      .send()
      .expect(404);
  });
});
