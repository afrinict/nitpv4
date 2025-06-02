import { logger } from './logger';
import { redisClient } from '../config/redis';

interface AlertThresholds {
  failedAttempts: number;
  suspiciousIPs: number;
  rateLimitExceeded: number;
  largeTransactions: number;
}

class MonitoringService {
  private static instance: MonitoringService;
  private readonly alertThresholds: AlertThresholds = {
    failedAttempts: 5,
    suspiciousIPs: 3,
    rateLimitExceeded: 10,
    largeTransactions: 1000000, // $1M
  };

  private constructor() {}

  public static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }

  async trackFinancialTransaction(type: string, data: any): Promise<void> {
    try {
      const timestamp = new Date().toISOString();
      const key = `financial:${type}:${timestamp}`;
      
      // Store transaction data
      await redisClient.set(key, JSON.stringify({
        type,
        timestamp,
        ...data,
      }));

      // Set expiration (30 days)
      await redisClient.expire(key, 30 * 24 * 60 * 60);

      // Check for large transactions
      if (data.amount && data.amount > this.alertThresholds.largeTransactions) {
        await this.triggerAlert('large_transaction', {
          type,
          amount: data.amount,
          ...data,
        });
      }

      logger.info(`Financial transaction tracked: ${type}`, { type, data });
    } catch (error) {
      logger.error('Error tracking financial transaction:', error);
    }
  }

  async trackFailedVerification(type: string, data: any): Promise<void> {
    try {
      const key = `failed_verification:${type}:${data.identifier}`;
      const count = await redisClient.incr(key);
      await redisClient.expire(key, 24 * 60 * 60); // 24 hours

      if (count >= this.alertThresholds.failedAttempts) {
        await this.triggerAlert('failed_verification', {
          type,
          count,
          ...data,
        });
      }

      logger.warn(`Failed verification tracked: ${type}`, { type, data, count });
    } catch (error) {
      logger.error('Error tracking failed verification:', error);
    }
  }

  async trackSuspiciousActivity(type: string, data: any): Promise<void> {
    try {
      const key = `suspicious:${type}:${data.ip}`;
      const count = await redisClient.incr(key);
      await redisClient.expire(key, 24 * 60 * 60); // 24 hours

      if (count >= this.alertThresholds.suspiciousIPs) {
        await this.triggerAlert('suspicious_activity', {
          type,
          count,
          ...data,
        });
      }

      logger.warn(`Suspicious activity tracked: ${type}`, { type, data, count });
    } catch (error) {
      logger.error('Error tracking suspicious activity:', error);
    }
  }

  async trackRateLimitExceeded(type: string, data: any): Promise<void> {
    try {
      const key = `rate_limit:${type}:${data.identifier}`;
      const count = await redisClient.incr(key);
      await redisClient.expire(key, 60 * 60); // 1 hour

      if (count >= this.alertThresholds.rateLimitExceeded) {
        await this.triggerAlert('rate_limit_exceeded', {
          type,
          count,
          ...data,
        });
      }

      logger.warn(`Rate limit exceeded tracked: ${type}`, { type, data, count });
    } catch (error) {
      logger.error('Error tracking rate limit exceeded:', error);
    }
  }

  private async triggerAlert(type: string, data: any): Promise<void> {
    try {
      // Store alert
      const timestamp = new Date().toISOString();
      const key = `alert:${type}:${timestamp}`;
      await redisClient.set(key, JSON.stringify({
        type,
        timestamp,
        ...data,
      }));
      await redisClient.expire(key, 7 * 24 * 60 * 60); // 7 days

      // Log alert
      logger.error(`Alert triggered: ${type}`, { type, data });

      // TODO: Implement notification system (email, SMS, etc.)
    } catch (error) {
      logger.error('Error triggering alert:', error);
    }
  }

  async getVerificationStats(): Promise<any> {
    try {
      const stats = {
        failedVerifications: await this.getCount('failed_verification:*'),
        suspiciousIPs: await this.getCount('suspicious:*'),
        rateLimitExceeded: await this.getCount('rate_limit:*'),
        alerts: await this.getCount('alert:*'),
      };

      return stats;
    } catch (error) {
      logger.error('Error getting verification stats:', error);
      throw error;
    }
  }

  public async getCount(pattern: string): Promise<number> {
    try {
      const keys = await redisClient.keys(pattern);
      return keys.length;
    } catch (error) {
      logger.error('Error getting count:', error);
      return 0;
    }
  }
}

export const monitoringService = MonitoringService.getInstance(); 