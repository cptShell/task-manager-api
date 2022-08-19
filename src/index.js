const express = require('express');
const sgMail = require('@sendgrid/mail');
require('./db/mongoose');
const { userRouter, taskRouter } = require('./routers/routers');

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
