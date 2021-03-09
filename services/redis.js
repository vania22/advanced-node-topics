const { promisify } = require('util');
const redis = require('redis');

const client = redis.createClient();
client.get = promisify(client.get).bind(client);

module.exports = client;
