const mongoose = require('mongoose');
require("dotenv").config();
const {DB_URL } = require("./src/configs/dbConfig");


const connectDB = async () => {
  try {
    await mongoose.connect(DB_URL);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error(error);
  }
};

module.exports = connectDB;
