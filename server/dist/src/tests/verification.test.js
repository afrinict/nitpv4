import VerificationService from '../services/verificationService';
import { redisClient } from '../config/redis';
import twilio from 'twilio';
import nodemailer from 'nodemailer';
// Mock dependencies
jest.mock('twilio');
jest.mock('nodemailer');
jest.mock('../config/redis');
describe('VerificationService', () => {
    let verificationService;
    const mockEmail = 'test@example.com';
    const mockPhone = '+1234567890';
    const mockOTP = '123456';
    beforeEach(() => {
        verificationService = VerificationService.getInstance();
        jest.clearAllMocks();
    });
    describe('sendEmailOTP', () => {
        it('should successfully send email OTP', async () => {
            const mockSendMail = jest.fn().mockResolvedValue(true);
            nodemailer.createTransport.mockReturnValue({
                sendMail: mockSendMail,
            });
            const result = await verificationService.sendEmailOTP(mockEmail);
            expect(result.success).toBe(true);
            expect(mockSendMail).toHaveBeenCalledWith(expect.objectContaining({
                to: mockEmail,
                subject: 'Your NITP Verification Code',
            }));
        });
        it('should handle email sending failure', async () => {
            const mockSendMail = jest.fn().mockRejectedValue(new Error('SMTP error'));
            nodemailer.createTransport.mockReturnValue({
                sendMail: mockSendMail,
            });
            const result = await verificationService.sendEmailOTP(mockEmail);
            expect(result.success).toBe(false);
            expect(result.message).toBe('Failed to send OTP');
        });
    });
    describe('sendPhoneOTP', () => {
        it('should successfully send phone OTP', async () => {
            const mockCreate = jest.fn().mockResolvedValue({});
            twilio.mockReturnValue({
                messages: { create: mockCreate },
            });
            const result = await verificationService.sendPhoneOTP(mockPhone);
            expect(result.success).toBe(true);
            expect(mockCreate).toHaveBeenCalledWith(expect.objectContaining({
                to: mockPhone,
            }));
        });
        it('should handle SMS sending failure', async () => {
            const mockCreate = jest.fn().mockRejectedValue(new Error('Twilio error'));
            twilio.mockReturnValue({
                messages: { create: mockCreate },
            });
            const result = await verificationService.sendPhoneOTP(mockPhone);
            expect(result.success).toBe(false);
            expect(result.message).toBe('Failed to send OTP');
        });
    });
    describe('verifyEmailOTP', () => {
        it('should successfully verify email OTP', async () => {
            redisClient.get.mockResolvedValue(mockOTP);
            redisClient.incr.mockResolvedValue(1);
            const result = await verificationService.verifyEmailOTP(mockEmail, mockOTP);
            expect(result.success).toBe(true);
            expect(result.message).toBe('OTP verified successfully');
        });
        it('should reject invalid OTP', async () => {
            redisClient.get.mockResolvedValue(mockOTP);
            redisClient.incr.mockResolvedValue(1);
            const result = await verificationService.verifyEmailOTP(mockEmail, '000000');
            expect(result.success).toBe(false);
            expect(result.message).toBe('Invalid OTP');
        });
        it('should handle expired OTP', async () => {
            redisClient.get.mockResolvedValue(null);
            redisClient.incr.mockResolvedValue(1);
            const result = await verificationService.verifyEmailOTP(mockEmail, mockOTP);
            expect(result.success).toBe(false);
            expect(result.message).toBe('OTP expired or not found');
        });
        it('should handle too many attempts', async () => {
            redisClient.get.mockResolvedValue(mockOTP);
            redisClient.incr.mockResolvedValue(4);
            const result = await verificationService.verifyEmailOTP(mockEmail, mockOTP);
            expect(result.success).toBe(false);
            expect(result.message).toBe('Too many attempts. Please request a new OTP.');
        });
    });
    describe('verifyPhoneOTP', () => {
        it('should successfully verify phone OTP', async () => {
            redisClient.get.mockResolvedValue(mockOTP);
            redisClient.incr.mockResolvedValue(1);
            const result = await verificationService.verifyPhoneOTP(mockPhone, mockOTP);
            expect(result.success).toBe(true);
            expect(result.message).toBe('OTP verified successfully');
        });
        it('should reject invalid OTP', async () => {
            redisClient.get.mockResolvedValue(mockOTP);
            redisClient.incr.mockResolvedValue(1);
            const result = await verificationService.verifyPhoneOTP(mockPhone, '000000');
            expect(result.success).toBe(false);
            expect(result.message).toBe('Invalid OTP');
        });
        it('should handle expired OTP', async () => {
            redisClient.get.mockResolvedValue(null);
            redisClient.incr.mockResolvedValue(1);
            const result = await verificationService.verifyPhoneOTP(mockPhone, mockOTP);
            expect(result.success).toBe(false);
            expect(result.message).toBe('OTP expired or not found');
        });
        it('should handle too many attempts', async () => {
            redisClient.get.mockResolvedValue(mockOTP);
            redisClient.incr.mockResolvedValue(4);
            const result = await verificationService.verifyPhoneOTP(mockPhone, mockOTP);
            expect(result.success).toBe(false);
            expect(result.message).toBe('Too many attempts. Please request a new OTP.');
        });
    });
});
