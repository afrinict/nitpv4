import Redis from 'ioredis';
import { logger } from '../utils/logger';
import { memoryStore } from '../utils/memoryStore';
let redisClient;
if (process.env.NODE_ENV === 'production') {
    redisClient = new Redis({
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD,
        retryStrategy: (times) => {
            const delay = Math.min(times * 50, 2000);
            return delay;
        },
    });
    redisClient.on('connect', () => {
        logger.info('Connected to Redis');
    });
    redisClient.on('error', (error) => {
        logger.error('Redis connection error:', error);
    });
}
else {
    redisClient = memoryStore;
    logger.info('Using in-memory store in development mode');
}
export { redisClient };
