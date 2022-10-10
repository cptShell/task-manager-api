const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/user');
const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account');
const isValidUpdate = require('../helpers/isValidUpdate');
const { auth } = require('../middleware/auth');

const router = new express.Router();

const upload = multer({
  limits: {
    fileSize: 1024 * 1024,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)/)) {
      return cb(new Error('Please upload an image'));
    }

    cb(undefined, true);
  },
});

router.post('/users', async (req, res) => {
  try {
    const { email } = req.body;
    const isExistedUser = await User.findOne({ email });

    if (isExistedUser) {
      res
        .status(400)
        .send({ error: 'User with this email address already exists' });
    }

    const user = new User(req.body);
    const token = await user.generateAuthToken();

    await user.save();
    sendWelcomeEmail(user.email, user.name);
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post('/users/login', async (req, res) => {
  const { password, email } = req.body;
  try {
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();

    res.send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      ({ token }) => token !== req.token
    );

    await req.user.save();

    res.send();
  } catch {
    res.status(500).send(error);
  }
});

router.post('/users/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = [];

    await req.user.save();

    res.send();
  } catch {
    res.status(500).send(error);
  }
});

router.post(
  '/users/me/avatar',
  auth,
  upload.single('avatar'),
  async (req, res) => {
    const { user, file } = req;

    const buffer = await sharp(file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();

    user.avatar = buffer;
    await user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.get('/users/me', auth, async (req, res) => {
  res.send(req.user);
});

router.get('/users', auth, async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/users/:id', async (req, res) => {
  const _id = req.params.id;

  try {
    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).send();
    }

    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/users/:id/avatar', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user || !user.avatar) {
      throw new Error();
    }

    res.set('Content-Type', 'image/png');
    res.send(user.avatar);
  } catch (e) {
    res.status(404).send();
  }
});

router.patch('/users/me', auth, async (req, res) => {
  const { user, body } = req;

  const allowedKeys = ['name', 'email', 'password', 'age'];
  const bodyKeys = Object.keys(body);

  if (!isValidUpdate(body, allowedKeys)) {
    return res.status(400).send({ error: 'Invalid updates' });
  }

  try {
    bodyKeys.forEach((key) => (user[key] = body[key]));

    await user.save();

    if (!user) {
      res.status(404).send();
    }

    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete('/users/me', auth, async (req, res) => {
  const { name, email } = req.user;

  try {
    await req.user.remove();
    sendCancelationEmail(email, name);
    res.send(req.user);
  } catch (error) {
    res.status(500).send();
  }
});

router.delete('/users/me/avatar', auth, async (req, res) => {
  const { user } = req;

  try {
    user.avatar = undefined;

    await user.save();
    res.send();
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
