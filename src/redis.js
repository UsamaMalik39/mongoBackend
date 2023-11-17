const redis = require('redis');
const { redisUrl } = require('./config');

const client = redis.createClient(redisUrl);

module.exports = client;
