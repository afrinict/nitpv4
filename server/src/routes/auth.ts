import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { generateAndStoreOTP, verifyOTP, clearOTP } from '../utils/redis';
import { sendEmail, sendSMS } from '../utils/notification';
import { upload } from '../utils/storage';

const router = Router();
const prisma = new PrismaClient();

// Send email OTP
router.post('/send-email-otp', async (req, res) => {
  try {
    const { email } = req.body;
    const otp = await generateAndStoreOTP(`email_otp:${email}`);
    
    await sendEmail({
      to: email,
      subject: 'NITP Registration - Email Verification',
      text: `Your verification code is: ${otp}`,
      html: `<p>Your verification code is: <strong>${otp}</strong></p>`
    });

    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending email OTP:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// Send phone OTP
router.post('/send-phone-otp', async (req, res) => {
  try {
    const { phone } = req.body;
    const otp = await generateAndStoreOTP(`phone_otp:${phone}`);
    
    await sendSMS({
      to: phone,
      message: `Your NITP registration verification code is: ${otp}`
    });

    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending phone OTP:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// Register user
router.post('/register', upload.single('certificateFile'), async (req, res) => {
  try {
    const {
      email,
      username,
      password,
      firstName,
      lastName,
      phone,
      membershipType,
      emailOtp,
      phoneOtp,
      // ... other fields
    } = req.body;

    // Check if email or username already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({
        error: 'Email or username already exists'
      });
    }

    // Verify OTPs
    const isEmailOtpValid = await verifyOTP(`email_otp:${email}`, emailOtp);
    const isPhoneOtpValid = await verifyOTP(`phone_otp:${phone}`, phoneOtp);

    if (!isEmailOtpValid || !isPhoneOtpValid) {
      return res.status(400).json({
        error: 'Invalid OTP'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification token and membership ID
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const membershipId = `NITP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Handle file upload
    let certificateUrl;
    if (req.file) {
      certificateUrl = `/uploads/${req.file.filename}`;
    }

    // Create user and member profile
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        verificationToken,
        isEmailVerified: true,
        isPhoneVerified: true,
        member: {
          create: {
            membershipId,
            membershipType,
            certificateUrl,
            // ... other member fields
          }
        }
      },
      include: {
        member: true
      }
    });

    // Clear OTPs
    await clearOTP(`email_otp:${email}`);
    await clearOTP(`phone_otp:${phone}`);

    // Send welcome email
    await sendEmail({
      to: email,
      subject: 'Welcome to NITP',
      text: `Welcome ${firstName}! Your registration is complete.`,
      html: `<h1>Welcome ${firstName}!</h1><p>Your registration is complete.</p>`
    });

    res.status(201).json({
      message: 'Registration successful',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        membershipId: user.member.membershipId
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

export default router; 