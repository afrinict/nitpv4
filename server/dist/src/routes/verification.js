import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import VerificationService from '../services/verificationService';
import { logger } from '../utils/logger';
import { upload } from '../../config/cloudinary';
import { uploadToCloudinary } from '../../config/cloudinary';
import { verifyToken } from '../middleware/auth';
import { submitSARApplication, submitEIARApplication, getSARApplications, getEIARApplications, updateSARStatus, updateEIARStatus } from '../services/verificationService';
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
// Submit SAR Application
router.post('/sar', verifyToken, upload.fields([
    { name: 'certificate', maxCount: 1 },
    { name: 'identification', maxCount: 1 },
    { name: 'additionalDocuments', maxCount: 5 }
]), async (req, res) => {
    try {
        const files = req.files;
        const fileUrls = {
            certificate: files.certificate?.[0] ? await uploadToCloudinary(files.certificate[0]) : null,
            identification: files.identification?.[0] ? await uploadToCloudinary(files.identification[0]) : null,
            additionalDocuments: await Promise.all((files.additionalDocuments || []).map(file => uploadToCloudinary(file)))
        };
        const application = await submitSARApplication({
            ...req.body,
            ...fileUrls,
            userId: req.user.id
        });
        res.status(201).json(application);
    }
    catch (error) {
        console.error('Error submitting SAR application:', error);
        res.status(500).json({ message: 'Error submitting application' });
    }
});
// Submit EIAR Application
router.post('/eiar', verifyToken, upload.fields([
    { name: 'certificate', maxCount: 1 },
    { name: 'identification', maxCount: 1 },
    { name: 'additionalDocuments', maxCount: 5 }
]), async (req, res) => {
    try {
        const files = req.files;
        const fileUrls = {
            certificate: files.certificate?.[0] ? await uploadToCloudinary(files.certificate[0]) : null,
            identification: files.identification?.[0] ? await uploadToCloudinary(files.identification[0]) : null,
            additionalDocuments: await Promise.all((files.additionalDocuments || []).map(file => uploadToCloudinary(file)))
        };
        const application = await submitEIARApplication({
            ...req.body,
            ...fileUrls,
            userId: req.user.id
        });
        res.status(201).json(application);
    }
    catch (error) {
        console.error('Error submitting EIAR application:', error);
        res.status(500).json({ message: 'Error submitting application' });
    }
});
// Get SAR Applications
router.get('/sar', verifyToken, async (req, res) => {
    try {
        const applications = await getSARApplications(req.user.id);
        res.json(applications);
    }
    catch (error) {
        console.error('Error fetching SAR applications:', error);
        res.status(500).json({ message: 'Error fetching applications' });
    }
});
// Get EIAR Applications
router.get('/eiar', verifyToken, async (req, res) => {
    try {
        const applications = await getEIARApplications(req.user.id);
        res.json(applications);
    }
    catch (error) {
        console.error('Error fetching EIAR applications:', error);
        res.status(500).json({ message: 'Error fetching applications' });
    }
});
// Update SAR Application Status
router.patch('/sar/:id', verifyToken, async (req, res) => {
    try {
        const application = await updateSARStatus(req.params.id, req.body.status);
        res.json(application);
    }
    catch (error) {
        console.error('Error updating SAR application:', error);
        res.status(500).json({ message: 'Error updating application' });
    }
});
// Update EIAR Application Status
router.patch('/eiar/:id', verifyToken, async (req, res) => {
    try {
        const application = await updateEIARStatus(req.params.id, req.body.status);
        res.json(application);
    }
    catch (error) {
        console.error('Error updating EIAR application:', error);
        res.status(500).json({ message: 'Error updating application' });
    }
});
export default router;
