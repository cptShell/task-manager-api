const mongoose = require('mongoose');

const connectionURL = process.env.MONGODB_URL;

mongoose.connect(connectionURL, (error) => {
  if (error) {
    return console.log(error);
  }
});
