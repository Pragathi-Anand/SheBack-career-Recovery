const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sheback', {
      serverSelectionTimeoutMS: 4000,
    });
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`[MongoDB] Local connection failed: ${error.message}`);
    console.warn(`[MongoDB] Running with in-memory fallback store for API operations.`);
    return false;
  }
};

module.exports = connectDB;
