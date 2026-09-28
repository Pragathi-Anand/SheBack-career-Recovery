const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!mongoUri) {
    console.warn('[MongoDB] No MONGO_URI environment variable configured.');
    return false;
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}, database: ${conn.connection.name}`);
    return true;
  } catch (error) {
    isConnected = false;
    console.warn(`[MongoDB] Primary connection failed (${mongoUri}): ${error.message}`);
    console.warn(`[MongoDB] Running with persistent fallback store for local development.`);
    return false;
  }
};

const getIsConnected = () => isConnected && mongoose.connection.readyState === 1;

connectDB.getIsConnected = getIsConnected;
connectDB.connectDB = connectDB;

module.exports = connectDB;
