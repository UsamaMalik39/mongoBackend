require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  mongodbUri: process.env.MONGODB_URI || 'mongodb+srv://mfaisalusama:zjasUMI2RHCp3Fta@cluster0.1hxkj4a.mongodb.net/Codistan',
  redisUrl: process.env.REDIS_URL || 'redis://128.199.135.131:6379',
};