const mongoose = require('mongoose');

const isMongoConnected = () => mongoose.connection.readyState === 1;

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/placement_portal';
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`✅ MongoDB Connected to: ${mongoose.connection.host}`);
  } catch (err) {
    console.warn(`⚠️ MongoDB not reachable (${err.message}).`);
    console.log(`ℹ️ Running in Mock Mode. Set MONGO_URI in .env for MongoDB.`);
  }
};

module.exports = { connectDB, isMongoConnected };
