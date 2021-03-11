const { promisify } = require('util');
const mongoose = require('mongoose');
const redis = require('redis');

// Setting up Redis client
const REDIS_URL = 'redis://127.0.0.1:6379';
const client = redis.createClient({ url: REDIS_URL });
client.get = promisify(client.get).bind(client);

mongoose.Query.prototype.cache = function () {
    this.useCache = true;

    return this;
};

// Rewriting mongoose's exec function to cache queries
const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.exec = async function () {
    if (!this.useCache) {
        return exec.apply(this, arguments);
    }
    // Creating a key to store in a cache and stringifying it
    const key = JSON.stringify({ ...this.getFilter(), collection: this.mongooseCollection.name });

    const cachedValue = await client.get(key);

    if (cachedValue) {
        const doc = JSON.parse(cachedValue);

        console.log('returning cached value');

        return Array.isArray(doc) ? doc.map((d) => new this.model(d)) : new this.model(doc);
    }

    const dbValue = await exec.apply(this, arguments);
    client.set(key, JSON.stringify(dbValue));

    console.log('from db but caching');

    return dbValue;
};
