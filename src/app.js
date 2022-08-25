const express = require('express');
const sgMail = require('@sendgrid/mail');
require('./db/mongoose');
const { userRouter, taskRouter } = require('./routers/routers');

const app = express();

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

module.exports = app;
