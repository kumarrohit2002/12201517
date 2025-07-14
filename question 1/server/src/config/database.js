const mongoose = require('mongoose');

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {

    });
    console.log('Database connection Stablished !!!');
  } catch (error) {
    console.error('Issue in Database Connection', error.message);
    process.exit(1);
  }
}

module.exports = dbConnection;