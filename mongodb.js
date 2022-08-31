const { MongoClient } = require('mongodb');

MongoClient.connect(process.env.MONGODB_URL, (error) => {
  if (error) {
    return console.log('Unable to conect to database!');
  }
});
