import { createClient } from 'redis';
import { logger } from './logger';

// Create Redis client
export const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

// Connect to Redis
redisClient.connect().catch(console.error);

// Handle Redis errors
redisClient.on('error', (err) => console.error('Redis Client Error:', err));

// Generate and store OTP
export async function generateAndStoreOTP(key: string, expirySeconds: number = 600): Promise<string> {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await redisClient.set(key, otp, { EX: expirySeconds });
  return otp;
}

// Verify OTP
export async function verifyOTP(key: string, otp: string): Promise<boolean> {
  const storedOTP = await redisClient.get(key);
  return storedOTP === otp;
}

// Clear OTP
export async function clearOTP(key: string): Promise<void> {
  await redisClient.del(key);
}

redisClient.on('connect', () => {
  logger.info('Redis client connected');
}); 