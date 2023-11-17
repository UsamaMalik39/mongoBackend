const redis = require('redis');
const { redisUrl } = require('./config');

const client = redis.createClient(redisUrl);

client.on('error', (err) => {
    console.error(`Redis Error: ${err}`);
  });
async function connect() {
  await client.connect();
}
connect();
module.exports = client;
