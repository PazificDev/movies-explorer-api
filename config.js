require('dotenv').config();

const {
  NODE_ENV,
  JWT_SECRET,
  PORT = 3000,
  MONGODB_URI = 'mongodb://127.0.0.1:27017/bitfilmsdb',
} = process.env;

const secretKey = NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret';

module.exports = {
  PORT,
  MONGODB_URI,
  secretKey,
};
