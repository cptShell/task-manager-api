const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { User, Task } = require('../../src/models/models');

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

const anotherOneUserId = new mongoose.Types.ObjectId();
const anotherOneUser = {
  _id: anotherOneUserId,
  name: 'NotZhenya',
  email: 'notzhenyamail@gmail.com',
  password: 'NoTaWeSoMePaSs111!!!',
  tokens: [
    {
      token: jwt.sign({ _id: anotherOneUserId }, process.env.JWT_SECRET),
    },
  ],
};

const firstTask = {
  _id: new mongoose.Types.ObjectId(),
  description: 'First task',
  completed: false,
  owner: user._id,
};

const secondTask = {
  _id: new mongoose.Types.ObjectId(),
  description: 'Second task',
  completed: true,
  owner: user._id,
};

const thirdTask = {
  _id: new mongoose.Types.ObjectId(),
  description: 'Third task',
  completed: true,
  owner: anotherOneUser._id,
};

const setupDatabase = async () => {
  await User.deleteMany({});
  await Task.deleteMany({});
  await new User(user).save();
  await new User(anotherOneUser).save();
  await new Task(firstTask).save();
  await new Task(secondTask).save();
  await new Task(thirdTask).save();
};

const closeConnection = () => mongoose.connection.close();

module.exports = {
  user,
  userId,
  firstTask,
  secondTask,
  thirdTask,
  setupDatabase,
  closeConnection,
};
