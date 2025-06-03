import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import VerificationService from '../services/verificationService';
import { logger } from '../utils/logger';
const router = Router();
const verificationService = VerificationService.getInstance();
// Middleware to validate request body
const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
};
// Send email OTP
router.post('/email-otp', [
    body('email').isEmail().withMessage('Invalid email address'),
], validateRequest, async (req, res) => {
    try {
        const { email } = req.body;
        const result = await verificationService.sendEmailOTP(email);
        res.json(result);
    }
    catch (error) {
        logger.error('Error in email OTP endpoint:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});
// Send phone OTP
router.post('/phone-otp', [
    body('phone').matches(/^\+?[1-9]\d{1,14}$/).withMessage('Invalid phone number'),
], validateRequest, async (req, res) => {
    try {
        const { phone } = req.body;
        const result = await verificationService.sendPhoneOTP(phone);
        res.json(result);
    }
    catch (error) {
        logger.error('Error in phone OTP endpoint:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});
// Send WhatsApp message
router.post('/whatsapp', [
    body('phone').matches(/^\+?[1-9]\d{1,14}$/).withMessage('Invalid phone number'),
    body('message').notEmpty().withMessage('Message is required'),
], validateRequest, async (req, res) => {
    try {
        const { phone, message } = req.body;
        const result = await verificationService.sendWhatsAppMessage(phone, message);
        res.json(result);
    }
    catch (error) {
        logger.error('Error in WhatsApp endpoint:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});
// Verify email OTP
router.post('/verify-email-otp', [
    body('email').isEmail().withMessage('Invalid email address'),
    body('otp').matches(/^\d{6}$/).withMessage('OTP must be 6 digits'),
], validateRequest, async (req, res) => {
    try {
        const { email, otp } = req.body;
        const result = await verificationService.verifyEmailOTP(email, otp);
        res.json(result);
    }
    catch (error) {
        logger.error('Error in email OTP verification endpoint:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});
// Verify phone OTP
router.post('/verify-phone-otp', [
    body('phone').matches(/^\+?[1-9]\d{1,14}$/).withMessage('Invalid phone number'),
    body('otp').matches(/^\d{6}$/).withMessage('OTP must be 6 digits'),
], validateRequest, async (req, res) => {
    try {
        const { phone, otp } = req.body;
        const result = await verificationService.verifyPhoneOTP(phone, otp);
        res.json(result);
    }
    catch (error) {
        logger.error('Error in phone OTP verification endpoint:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});
export default router;
