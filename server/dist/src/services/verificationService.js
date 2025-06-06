import twilio from 'twilio';
import nodemailer from 'nodemailer';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { logger } from '../utils/logger';
import { redisClient } from '../config/redis';
import { monitoringService } from '../utils/monitoring';
import { query } from '../../utils/db';
// Initialize Twilio client
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
// Initialize email transporter
const emailTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});
// Rate limiter configuration
const rateLimiter = new RateLimiterMemory({
    points: 5, // Number of attempts
    duration: 60, // Per minute
});
// OTP configuration
const OTP_CONFIG = {
    length: 6,
    expiry: 300, // 5 minutes in seconds
    maxAttempts: 3,
};
class VerificationService {
    constructor() { }
    static getInstance() {
        if (!VerificationService.instance) {
            VerificationService.instance = new VerificationService();
        }
        return VerificationService.instance;
    }
    generateOTP() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
    async storeOTP(key, otp) {
        await redisClient.set(key, otp, 'EX', OTP_CONFIG.expiry);
    }
    async getStoredOTP(key) {
        return await redisClient.get(key);
    }
    async incrementAttempts(key) {
        return await redisClient.incr(`${key}:attempts`);
    }
    async resetAttempts(key) {
        await redisClient.del(`${key}:attempts`);
    }
    async sendEmailOTP(email, ip) {
        try {
            // Check rate limit
            await rateLimiter.consume(`email:${email}`);
            const otp = this.generateOTP();
            const key = `email_otp:${email}`;
            // Store OTP
            await this.storeOTP(key, otp);
            await this.resetAttempts(key);
            // Send email
            await emailTransporter.sendMail({
                from: process.env.SMTP_FROM,
                to: email,
                subject: 'Your NITP Verification Code',
                html: `
          <h1>Your Verification Code</h1>
          <p>Your verification code is: <strong>${otp}</strong></p>
          <p>This code will expire in 5 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
        `,
            });
            logger.info(`Email OTP sent to ${email}`);
            return { success: true, message: 'OTP sent successfully' };
        }
        catch (error) {
            logger.error('Error sending email OTP:', error);
            await monitoringService.trackFailedVerification('email', email, 'Failed to send OTP', ip);
            return { success: false, message: 'Failed to send OTP' };
        }
    }
    async sendPhoneOTP(phone, ip) {
        try {
            // Check rate limit
            await rateLimiter.consume(`phone:${phone}`);
            const otp = this.generateOTP();
            const key = `phone_otp:${phone}`;
            // Store OTP
            await this.storeOTP(key, otp);
            await this.resetAttempts(key);
            // Send SMS
            await twilioClient.messages.create({
                body: `Your NITP verification code is: ${otp}. This code will expire in 5 minutes.`,
                to: phone,
                from: process.env.TWILIO_PHONE_NUMBER,
            });
            logger.info(`SMS OTP sent to ${phone}`);
            return { success: true, message: 'OTP sent successfully' };
        }
        catch (error) {
            logger.error('Error sending phone OTP:', error);
            await monitoringService.trackFailedVerification('phone', phone, 'Failed to send OTP', ip);
            return { success: false, message: 'Failed to send OTP' };
        }
    }
    async sendWhatsAppMessage(phone, message, ip) {
        try {
            // Check rate limit
            await rateLimiter.consume(`whatsapp:${phone}`);
            // Send WhatsApp message
            await twilioClient.messages.create({
                body: message,
                to: `whatsapp:${phone}`,
                from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
            });
            logger.info(`WhatsApp message sent to ${phone}`);
            return { success: true, message: 'Message sent successfully' };
        }
        catch (error) {
            logger.error('Error sending WhatsApp message:', error);
            await monitoringService.trackFailedVerification('phone', phone, 'Failed to send WhatsApp message', ip);
            return { success: false, message: 'Failed to send message' };
        }
    }
    async verifyEmailOTP(email, otp, ip) {
        try {
            const key = `email_otp:${email}`;
            const storedOTP = await this.getStoredOTP(key);
            const attempts = await this.incrementAttempts(key);
            if (attempts > OTP_CONFIG.maxAttempts) {
                await monitoringService.trackFailedVerification('email', email, 'Too many attempts', ip);
                return { success: false, message: 'Too many attempts. Please request a new OTP.' };
            }
            if (!storedOTP) {
                await monitoringService.trackFailedVerification('email', email, 'OTP expired', ip);
                return { success: false, message: 'OTP expired or not found' };
            }
            if (storedOTP !== otp) {
                await monitoringService.trackFailedVerification('email', email, 'Invalid OTP', ip);
                return { success: false, message: 'Invalid OTP' };
            }
            // Clear OTP and attempts after successful verification
            await redisClient.del(key);
            await this.resetAttempts(key);
            logger.info(`Email OTP verified for ${email}`);
            return { success: true, message: 'OTP verified successfully' };
        }
        catch (error) {
            logger.error('Error verifying email OTP:', error);
            await monitoringService.trackFailedVerification('email', email, 'Verification error', ip);
            return { success: false, message: 'Failed to verify OTP' };
        }
    }
    async verifyPhoneOTP(phone, otp, ip) {
        try {
            const key = `phone_otp:${phone}`;
            const storedOTP = await this.getStoredOTP(key);
            const attempts = await this.incrementAttempts(key);
            if (attempts > OTP_CONFIG.maxAttempts) {
                await monitoringService.trackFailedVerification('phone', phone, 'Too many attempts', ip);
                return { success: false, message: 'Too many attempts. Please request a new OTP.' };
            }
            if (!storedOTP) {
                await monitoringService.trackFailedVerification('phone', phone, 'OTP expired', ip);
                return { success: false, message: 'OTP expired or not found' };
            }
            if (storedOTP !== otp) {
                await monitoringService.trackFailedVerification('phone', phone, 'Invalid OTP', ip);
                return { success: false, message: 'Invalid OTP' };
            }
            // Clear OTP and attempts after successful verification
            await redisClient.del(key);
            await this.resetAttempts(key);
            logger.info(`Phone OTP verified for ${phone}`);
            return { success: true, message: 'OTP verified successfully' };
        }
        catch (error) {
            logger.error('Error verifying phone OTP:', error);
            await monitoringService.trackFailedVerification('phone', phone, 'Verification error', ip);
            return { success: false, message: 'Failed to verify OTP' };
        }
    }
    async submitSARApplication(data) {
        try {
            const result = await query(`INSERT INTO sar_applications (
          user_id, certificate_url, identification_url, 
          additional_documents, status, comments
        ) VALUES ($1, $2, $3, $4, $5, $6) 
        RETURNING *`, [
                data.userId,
                data.certificate,
                data.identification,
                data.additionalDocuments,
                'PENDING',
                data.comments
            ]);
            return result.rows[0];
        }
        catch (error) {
            logger.error('Error submitting SAR application:', error);
            throw error;
        }
    }
    async submitEIARApplication(data) {
        try {
            const result = await query(`INSERT INTO eiar_applications (
          user_id, certificate_url, identification_url, 
          additional_documents, status, comments
        ) VALUES ($1, $2, $3, $4, $5, $6) 
        RETURNING *`, [
                data.userId,
                data.certificate,
                data.identification,
                data.additionalDocuments,
                'PENDING',
                data.comments
            ]);
            return result.rows[0];
        }
        catch (error) {
            logger.error('Error submitting EIAR application:', error);
            throw error;
        }
    }
    async getSARApplications(userId) {
        try {
            const result = await query('SELECT * FROM sar_applications WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
            return result.rows;
        }
        catch (error) {
            logger.error('Error fetching SAR applications:', error);
            throw error;
        }
    }
    async getEIARApplications(userId) {
        try {
            const result = await query('SELECT * FROM eiar_applications WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
            return result.rows;
        }
        catch (error) {
            logger.error('Error fetching EIAR applications:', error);
            throw error;
        }
    }
    async updateSARStatus(id, status) {
        try {
            const result = await query('UPDATE sar_applications SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *', [status, id]);
            return result.rows[0];
        }
        catch (error) {
            logger.error('Error updating SAR application status:', error);
            throw error;
        }
    }
    async updateEIARStatus(id, status) {
        try {
            const result = await query('UPDATE eiar_applications SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *', [status, id]);
            return result.rows[0];
        }
        catch (error) {
            logger.error('Error updating EIAR application status:', error);
            throw error;
        }
    }
}
export default VerificationService;
