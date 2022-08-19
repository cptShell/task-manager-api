const express = require('express');
const { Task } = require('../models/models');
const isValidUpdate = require('../helpers/isValidUpdate');
const { auth } = require('../middleware/auth');
const router = new express.Router();

router.post('/tasks', auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id,
  });

  try {
    await task.save();
    res.send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get('/tasks', auth, async (req, res) => {
  const { completed, limit, page, sortBy } = req.query;
  const match = {};
  const sort = {};

  if (completed) {
    match.completed = completed === 'true';
  }

  if (sortBy) {
    const [key, value] = sortBy.split(':');
    sort[key] = value;
  }

  console.log(sort);

  try {
    await req.user.populate({
      path: 'tasks',
      match,
      options: {
        limit: parseInt(limit),
        page: parseInt(page),
        sort,
      },
    });
    res.send(req.user.tasks);
  } catch (error) {
    res.status(500).send();
  }
});

router.get('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findOne({ _id, owner: req.user._id });

    if (!task) {
      return res.status(400).send();
    }

    return res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.patch('/tasks/:id', auth, async (req, res) => {
  const bodyKeys = Object.keys(req.body);
  const taskKeys = ['description', 'completed'];

  if (!isValidUpdate(req.body, taskKeys)) {
    return res.status(400).send({ error: 'Invalid updates' });
  }

  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!task) {
      return res.status(404).send({ error: 'Task not found!' });
    }

    bodyKeys.forEach((key) => (task[key] = req.body[key]));

    await task.save();

    res.send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete('/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!task) {
      return res.status(404).send({ error: 'Task not found' });
    }

    res.send(task);
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;
