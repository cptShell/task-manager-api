const { MongoClient } = require('mongodb');
const databaseName = 'task-manager';

MongoClient.connect(process.env.MONGODB_URL, (error, client) => {
  if (error) {
    return console.log('Unable to conect to database!');
  }

  const db = client.db(databaseName);
  const tasksCollection = db.collection('tasks');

  tasksCollection.deleteMany(
    {
      completed: true,
    },
    (error, result) => {
      if (error) {
        console.log('Unable to fetch!');
      }

      console.log(result);
    }
  );
});
