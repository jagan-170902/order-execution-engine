import 'dotenv/config';
import { Queue } from 'bullmq';
import IORedis from 'ioredis';

const redisUrl = process.env.REDIS_URL;
if (!redisUrl) throw new Error('REDIS_URL is not defined in .env');

export const connection = new IORedis(redisUrl, {
  maxRetriesPerRequest: null,
});

export const orderQueue = new Queue('orders', { connection });

// Test Redis connection
connection.on('connect', () => console.log('✅ Redis connected for Queue'));
connection.on('error', (err) => console.error('❌ Redis error:', err));