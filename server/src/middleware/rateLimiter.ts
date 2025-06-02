import { Request, Response, NextFunction } from 'express';
import { RateLimiterRedis, RateLimiterMemory } from 'rate-limiter-flexible';
import Redis from 'ioredis';
import { redisClient } from '../config/redis';
import { logger } from '../utils/logger';

// Create rate limiters based on Redis availability
const createRateLimiter = (options: any) => {
  if (process.env.NODE_ENV === 'production' && redisClient instanceof Redis) {
    return new RateLimiterRedis({
      storeClient: redisClient,
      ...options,
    });
  }
  return new RateLimiterMemory(options);
};

// IP-based rate limiter
const ipRateLimiter = createRateLimiter({
  keyPrefix: 'ip_rate_limit',
  points: 100, // Number of requests
  duration: 60, // Per minute
  blockDuration: 60 * 15, // Block for 15 minutes if limit exceeded
});

// Endpoint-specific rate limiters
const endpointLimiters = {
  emailOTP: createRateLimiter({
    keyPrefix: 'email_otp_limit',
    points: 5,
    duration: 60,
    blockDuration: 60 * 15,
  }),
  phoneOTP: createRateLimiter({
    keyPrefix: 'phone_otp_limit',
    points: 5,
    duration: 60,
    blockDuration: 60 * 15,
  }),
  whatsapp: createRateLimiter({
    keyPrefix: 'whatsapp_limit',
    points: 5,
    duration: 60,
    blockDuration: 60 * 15,
  }),
};

export const rateLimiter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ip = req.ip || 'unknown';
    const pathParts = req.path.split('/');
    const endpoint = pathParts[pathParts.length - 1] || 'default';

    // Apply IP-based rate limiting
    await ipRateLimiter.consume(ip);

    // Apply endpoint-specific rate limiting if applicable
    if (endpoint in endpointLimiters) {
      const limiter = endpointLimiters[endpoint as keyof typeof endpointLimiters];
      await limiter.consume(ip);
    }

    next();
  } catch (error) {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}, Endpoint: ${req.path}`);
    res.status(429).json({
      success: false,
      message: 'Too many requests. Please try again later.',
    });
  }
};

// Middleware to check for suspicious activity
export const suspiciousActivityCheck = async (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip || 'unknown';
  const key = `suspicious_activity:${ip}`;
  
  try {
    const attempts = await redisClient.incr(key);
    await redisClient.expire(key, 3600); // Expire after 1 hour

    if (attempts > 10) {
      logger.warn(`Suspicious activity detected from IP: ${ip}`);
      return res.status(403).json({
        success: false,
        message: 'Access denied due to suspicious activity.',
      });
    }

    next();
  } catch (error) {
    logger.error('Error in suspicious activity check:', error);
    next();
  }
}; 