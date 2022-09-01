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

const fourthTask = {
  _id: new mongoose.Types.ObjectId(),
  description: 'Fourth task',
  completed: true,
  owner: anotherOneUser._id,
};

const fifthTask = {
  _id: new mongoose.Types.ObjectId(),
  description: 'Fifth task',
  completed: false,
  owner: anotherOneUser._id,
};

const sixthTask = {
  _id: new mongoose.Types.ObjectId(),
  description: 'Sixth task',
  completed: false,
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
  await new Task(fourthTask).save();
  await new Task(fifthTask).save();
  await new Task(sixthTask).save();
};

const closeConnection = () => mongoose.connection.close();

module.exports = {
  user,
  userId,
  anotherOneUser,
  anotherOneUserId,
  firstTask,
  secondTask,
  thirdTask,
  fourthTask,
  fifthTask,
  setupDatabase,
  closeConnection,
};
