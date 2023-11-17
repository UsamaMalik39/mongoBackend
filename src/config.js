require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/yourdb',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
};