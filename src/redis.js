const redis = require('redis');
const { redisUrl } = require('./config');
const axios = require('axios');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

const updateIpAddress = async () => {
  try {
    const response = await axios.get('https://ifconfig.me/ip');
    const ipAddress = response.data.trim();

    process.env.REDIS_URL = 'redis://'+ipAddress+':6379';
    fs.writeFileSync('.env', `REDIS_URL=${process.env.REDIS_URL}\n`);
    console.log('Server IP Address updated:', ipAddress);
  } catch (error) {
    console.error('Error updating IP address:', error.message);
  }
};


// updateIpAddress();
const client = redis.createClient({ host: '128.199.135.131', port: 6379 });

client.on('error', (err) => {
    console.error(`Redis Error: ${err}`);
  });
async function connect() {
  await client.connect();
}
connect();
module.exports = client;
