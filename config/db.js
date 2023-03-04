const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const db = process.env.DATABASE_URI;


const connectDB = async () => {
  try {
    await mongoose.connect(db.toString(), {
      useUnifiedTopology: true,
      useNewUrlParser: true
      // useCreateIndex: true,
    });
    console.log('Mongoose DB running');
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
