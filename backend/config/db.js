const mongoose = require('mongoose');
const env = require('./env');

const MAX_RETRIES = 5;
const RETRY_INTERVAL_MS = 5000;

let retryCount = 0;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGO_URI, {
      autoIndex: true, // Build indexes including TTL index for OTPs
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`✅ [MongoDB] Connected successfully to host: ${conn.connection.host}`);
    console.log(`📦 [MongoDB] Database name: ${conn.connection.name}`);
    retryCount = 0;
  } catch (error) {
    retryCount++;
    console.error(`❌ [MongoDB Connection Error] (Attempt ${retryCount}/${MAX_RETRIES}):`, error.message);

    if (retryCount < MAX_RETRIES) {
      console.log(`🔄 [MongoDB] Retrying connection in ${RETRY_INTERVAL_MS / 1000} seconds...`);
      setTimeout(connectDB, RETRY_INTERVAL_MS);
    } else {
      console.error('💥 [MongoDB Fatal] Max connection retries reached. Check your MONGO_URI in .env.');
    }
  }
};

// Listen to Mongoose connection events
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ [MongoDB] Disconnected from database.');
});

mongoose.connection.on('reconnected', () => {
  console.log('🔄 [MongoDB] Reconnected to database.');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ [MongoDB Runtime Error]:', err.message);
});

module.exports = connectDB;
