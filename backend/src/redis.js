import { createClient } from 'redis';
import { config } from './config.js';

let clientPromise = null;

export async function getRedisClient() {
  if (!clientPromise) {
    const url = `redis://${config.redis.host}:${config.redis.port}`;
    const client = createClient({
      url,
      password: config.redis.password || undefined,
      database: config.redis.db,
    });

    client.on('error', (err) => {
      console.error('Redis client error:', err.message);
    });

    clientPromise = client.connect().then(() => client);
  }

  return clientPromise;
}
