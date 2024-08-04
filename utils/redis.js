import { createClient } from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    this.client = createClient().on('error', (e) => console.log(`Failed: ${e}`));
    this.get = promisify(this.client.get).bind(this.client);
    this.del = promisify(this.client.del).bind(this.client);
  }

  isAlive() {
    return this.client.connected;
  }

  async get(key) {
    return await this.get(key);
  }

  async set(key, value, duration) {
    this.client.set(key, value, 'EX', duration);
  }

  async del(key) {
    await this.del(key);
  }
}

const redisClient = new RedisClient();
module.exports = redisClient;
