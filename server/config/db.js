const mongoose = require('mongoose');

let connectionAttempt;

mongoose.connection.on('error', (err) => {
  // Do not log a connection URI or credentials as part of driver errors.
  console.warn('MongoDB connection error:', err.name || 'UnknownError');
});

const isMongoConnected = () => mongoose.connection.readyState === 1;
const isProduction = () => process.env.NODE_ENV === 'production' || Boolean(process.env.VERCEL);

const getMongoURI = () => {
  let uri = process.env.MONGO_URI || '';
  // Accept common Vercel copy/paste mistakes while never logging the secret.
  uri = uri.trim().replace(/^MONGO_URI\s*=\s*/i, '').replace(/^(['"])(.*)\1$/, '$2').trim();
  return uri;
};

const connectDB = async () => {
  if (isMongoConnected()) return true;
  if (connectionAttempt) return connectionAttempt;

  const mongoURI = getMongoURI();
  if (!mongoURI) {
    if (isProduction()) console.error('MONGO_URI is missing; production database requests are unavailable.');
    return false;
  }
  if (!/^mongodb(?:\+srv)?:\/\//i.test(mongoURI)) {
    console.error('MONGO_URI must begin with mongodb:// or mongodb+srv://.');
    return false;
  }

  mongoose.set('strictQuery', false);
  connectionAttempt = mongoose.connect(mongoURI, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 10000,
    maxPoolSize: 10,
    minPoolSize: 0,
    maxIdleTimeMS: 30000
  }).then(() => {
    console.log(`MongoDB connected to host: ${mongoose.connection.host}`);
    return true;
  }).catch((err) => {
    console.error(`MongoDB connection failed (${err.name || 'UnknownError'}).`);
    return false;
  }).finally(() => {
    connectionAttempt = null;
  });

  return connectionAttempt;
};

module.exports = { connectDB, isMongoConnected, isProduction };
