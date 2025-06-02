import { authenticator } from 'otplib';
import QRCode from 'qrcode';
import { redisClient } from '../config/redis';
import { logger } from '../utils/logger';
import { monitoringService } from '../utils/monitoring';

interface TwoFactorConfig {
  enabled: boolean;
  method: 'authenticator' | 'sms' | 'email';
  secret?: string;
}

class TwoFactorService {
  private static instance: TwoFactorService;
  private readonly CACHE_TTL = 300; // 5 minutes in seconds

  private constructor() {}

  public static getInstance(): TwoFactorService {
    if (!TwoFactorService.instance) {
      TwoFactorService.instance = new TwoFactorService();
    }
    return TwoFactorService.instance;
  }

  async setupTwoFactor(userId: string, method: 'authenticator' | 'sms' | 'email'): Promise<{ secret: string; qrCode: string }> {
    try {
      const secret = authenticator.generateSecret();
      const otpauth = authenticator.keyuri(userId, 'NITP', secret);
      const qrCode = await QRCode.toDataURL(otpauth);

      // Store the secret temporarily
      await redisClient.set(`2fa_setup:${userId}`, secret, 'EX', this.CACHE_TTL);

      return { secret, qrCode };
    } catch (error) {
      logger.error('Error setting up 2FA:', error);
      throw new Error('Failed to setup 2FA');
    }
  }

  async verifyTwoFactorSetup(userId: string, token: string): Promise<boolean> {
    try {
      const secret = await redisClient.get(`2fa_setup:${userId}`);
      if (!secret) {
        throw new Error('2FA setup expired or not found');
      }

      const isValid = authenticator.verify({ token, secret });
      if (isValid) {
        // Store the verified secret permanently
        await redisClient.set(`2fa:${userId}`, secret);
        await redisClient.del(`2fa_setup:${userId}`);
      }

      return isValid;
    } catch (error) {
      logger.error('Error verifying 2FA setup:', error);
      return false;
    }
  }

  async verifyTwoFactor(userId: string, token: string, ip: string): Promise<boolean> {
    try {
      const secret = await redisClient.get(`2fa:${userId}`);
      if (!secret) {
        await monitoringService.trackFailedVerification('2fa', userId, '2FA not enabled', ip);
        return false;
      }

      const isValid = authenticator.verify({ token, secret });
      if (!isValid) {
        await monitoringService.trackFailedVerification('2fa', userId, 'Invalid 2FA token', ip);
      }

      return isValid;
    } catch (error) {
      logger.error('Error verifying 2FA:', error);
      await monitoringService.trackFailedVerification('2fa', userId, '2FA verification error', ip);
      return false;
    }
  }

  async disableTwoFactor(userId: string): Promise<void> {
    try {
      await redisClient.del(`2fa:${userId}`);
    } catch (error) {
      logger.error('Error disabling 2FA:', error);
      throw new Error('Failed to disable 2FA');
    }
  }

  async isTwoFactorEnabled(userId: string): Promise<boolean> {
    try {
      const secret = await redisClient.get(`2fa:${userId}`);
      return !!secret;
    } catch (error) {
      logger.error('Error checking 2FA status:', error);
      return false;
    }
  }

  async getTwoFactorConfig(userId: string): Promise<TwoFactorConfig> {
    try {
      const secret = await redisClient.get(`2fa:${userId}`);
      return {
        enabled: !!secret,
        method: 'authenticator',
        secret: secret || undefined,
      };
    } catch (error) {
      logger.error('Error getting 2FA config:', error);
      return { enabled: false, method: 'authenticator' };
    }
  }
}

export const twoFactorService = TwoFactorService.getInstance(); 