import express, { Router, Request, Response } from "express";
import session from "express-session";
import MemoryStore from "memorystore";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupSocketServer } from "./socket";
import { isAuthenticated, hasRole, hashPassword, comparePassword, generateToken, loginUser, logoutUser, generateMembershipId, calculateSubscriptionFee, calculateApplicationFee, verifyActiveSubscription, creditsToNaira, nairaToCredits } from "./auth";
import { initiatePayment, verifyPayment, generateTransactionReference } from "./paystack";
import { membershipTypeEnum, loginSchema, users, members } from "@shared/schema";
import { AuthUser } from "@shared/types";

export async function registerRoutes(app: express.Express): Promise<Server> {
  // Setup session store
  const MemorySessionStore = MemoryStore(session);
  const sessionStore = new MemorySessionStore({
    checkPeriod: 86400000 // 24 hours
  });

  // Session middleware
  app.use(session({
    secret: process.env.SESSION_SECRET || 'nitp-session-secret',
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 // 24 hours
    }
  }));

  // Setup Passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Configure Passport
  passport.use(new LocalStrategy({
    usernameField: 'identifier',
    passwordField: 'password'
  }, async (identifier, password, done) => {
    try {
      // Check if identifier is email, username, or membership ID
      const user = await storage.getUserByIdentifier(identifier);
      
      if (!user) {
        return done(null, false, { message: 'Invalid credentials' });
      }
      
      const isPasswordValid = await comparePassword(password, user.password);
      
      if (!isPasswordValid) {
        return done(null, false, { message: 'Invalid credentials' });
      }
      
      // Update last login time
      await storage.updateUserLastLogin(user.id);
      
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }));

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);
  
  // Setup Socket.IO
  const io = setupSocketServer(httpServer);

  // API routes
  const apiRouter = Router();
  app.use('/api', apiRouter);

  // Authentication routes
  const authRouter = Router();
  apiRouter.use('/auth', authRouter);

  // Login
  authRouter.post('/login', (req, res, next) => {
    const result = loginSchema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation failed', 
        errors: result.error.format() 
      });
    }
    
    passport.authenticate('local', (err: any, user: any, info: any) => {
      if (err) {
        return next(err);
      }
      
      if (!user) {
        return res.status(401).json({ success: false, message: info.message });
      }
      
      req.login(user, (err) => {
        if (err) {
          return next(err);
        }
        
        const userInfo: AuthUser = {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          membershipId: user.membershipId,
          isVerified: user.isVerified
        };
        
        return res.json({ success: true, user: userInfo });
      });
    })(req, res, next);
  });

  // Register
  authRouter.post('/register', async (req, res) => {
    try {
      const { email, username, password, membershipType, ...memberData } = req.body;
      
      // Check if email already exists
      const existingEmail = await storage.getUserByEmail(email);
      if (existingEmail) {
        return res.status(400).json({ success: false, message: 'Email already exists' });
      }
      
      // Check if username already exists
      const existingUsername = await storage.getUserByUsername(username);
      if (existingUsername) {
        return res.status(400).json({ success: false, message: 'Username already exists' });
      }
      
      // Hash password and generate verification token
      const hashedPassword = await hashPassword(password);
      const verificationToken = generateToken();
      const membershipId = generateMembershipId(membershipType);
      
      // Create user
      const user = await storage.createUser({
        email,
        username,
        password: hashedPassword,
        role: 'MEMBER',
        membershipId,
        verificationToken
      });
      
      // Create member profile
      const member = await storage.createMember({
        userId: user.id,
        type: membershipType as typeof membershipTypeEnum.enumValues[number],
        ...memberData
      });
      
      // TODO: Send verification email
      
      res.status(201).json({ 
        success: true, 
        message: 'Registration successful. Please verify your email.', 
        userId: user.id, 
        memberId: member.id,
        membershipId
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      res.status(500).json({ success: false, message: 'Registration failed', error: error.message });
    }
  });

  // Verify Email
  authRouter.get('/verify/:token', async (req, res) => {
    try {
      const { token } = req.params;
      
      const user = await storage.getUserByVerificationToken(token);
      
      if (!user) {
        return res.status(400).json({ success: false, message: 'Invalid or expired verification token' });
      }
      
      // Mark user as verified
      await storage.verifyUser(user.id);
      
      res.json({ success: true, message: 'Email verified successfully. You can now log in.' });
    } catch (error: any) {
      console.error('Email verification error:', error);
      res.status(500).json({ success: false, message: 'Verification failed', error: error.message });
    }
  });

  // Forgot Password
  authRouter.post('/forgot-password', async (req, res) => {
    try {
      const { email } = req.body;
      
      const user = await storage.getUserByEmail(email);
      
      if (!user) {
        // Don't reveal user existence, return success anyway
        return res.json({ success: true, message: 'If your email exists in our system, you will receive a password reset link' });
      }
      
      const resetToken = generateToken();
      const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now
      
      await storage.setPasswordResetToken(user.id, resetToken, resetTokenExpiry);
      
      // TODO: Send password reset email
      
      res.json({ success: true, message: 'If your email exists in our system, you will receive a password reset link' });
    } catch (error: any) {
      console.error('Forgot password error:', error);
      res.status(500).json({ success: false, message: 'Request failed', error: error.message });
    }
  });

  // Reset Password
  authRouter.post('/reset-password/:token', async (req, res) => {
    try {
      const { token } = req.params;
      const { password } = req.body;
      
      const user = await storage.getUserByResetToken(token);
      
      if (!user || !user.resetTokenExpiry || new Date(user.resetTokenExpiry) < new Date()) {
        return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
      }
      
      const hashedPassword = await hashPassword(password);
      
      await storage.updatePassword(user.id, hashedPassword);
      
      res.json({ success: true, message: 'Password reset successful. You can now log in with your new password.' });
    } catch (error: any) {
      console.error('Reset password error:', error);
      res.status(500).json({ success: false, message: 'Password reset failed', error: error.message });
    }
  });

  // Logout
  authRouter.post('/logout', (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Logout failed', error: err.message });
      }
      
      res.json({ success: true, message: 'Logged out successfully' });
    });
  });

  // User profile
  authRouter.get('/me', isAuthenticated, async (req, res) => {
    try {
      const userId = req.session.userId;
      
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
      }
      
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      
      const member = await storage.getMemberByUserId(userId);
      
      const userInfo: AuthUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        membershipId: user.membershipId,
        isVerified: user.isVerified
      };
      
      res.json({ success: true, user: userInfo, member });
    } catch (error: any) {
      console.error('Get profile error:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch profile', error: error.message });
    }
  });

  // Member routes
  const memberRouter = Router();
  apiRouter.use('/members', memberRouter);

  // Get member profile
  memberRouter.get('/profile', isAuthenticated, async (req, res) => {
    try {
      const userId = req.session.userId;
      const member = await storage.getMemberByUserId(userId!);
      
      if (!member) {
        return res.status(404).json({ success: false, message: 'Member profile not found' });
      }
      
      const education = await storage.getEducationQualifications(member.id);
      const professional = await storage.getProfessionalQualifications(member.id);
      const employment = await storage.getEmploymentHistory(member.id);
      
      res.json({
        success: true,
        member: {
          ...member,
          educationQualifications: education,
          professionalQualifications: professional,
          employmentHistory: employment
        }
      });
    } catch (error: any) {
      console.error('Get member profile error:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch member profile', error: error.message });
    }
  });

  // Update member profile
  memberRouter.put('/profile', isAuthenticated, async (req, res) => {
    try {
      const userId = req.session.userId;
      const member = await storage.getMemberByUserId(userId!);
      
      if (!member) {
        return res.status(404).json({ success: false, message: 'Member profile not found' });
      }
      
      const updatedMember = await storage.updateMember(member.id, req.body);
      
      res.json({ success: true, member: updatedMember });
    } catch (error: any) {
      console.error('Update member profile error:', error);
      res.status(500).json({ success: false, message: 'Failed to update member profile', error: error.message });
    }
  });

  // Add education qualification
  memberRouter.post('/education', isAuthenticated, async (req, res) => {
    try {
      const userId = req.session.userId;
      const member = await storage.getMemberByUserId(userId!);
      
      if (!member) {
        return res.status(404).json({ success: false, message: 'Member profile not found' });
      }
      
      const education = await storage.addEducationQualification({
        memberId: member.id,
        ...req.body
      });
      
      res.status(201).json({ success: true, education });
    } catch (error: any) {
      console.error('Add education error:', error);
      res.status(500).json({ success: false, message: 'Failed to add education qualification', error: error.message });
    }
  });

  // Add professional qualification
  memberRouter.post('/professional', isAuthenticated, async (req, res) => {
    try {
      const userId = req.session.userId;
      const member = await storage.getMemberByUserId(userId!);
      
      if (!member) {
        return res.status(404).json({ success: false, message: 'Member profile not found' });
      }
      
      const professional = await storage.addProfessionalQualification({
        memberId: member.id,
        ...req.body
      });
      
      res.status(201).json({ success: true, professional });
    } catch (error: any) {
      console.error('Add professional qualification error:', error);
      res.status(500).json({ success: false, message: 'Failed to add professional qualification', error: error.message });
    }
  });

  // Add employment history
  memberRouter.post('/employment', isAuthenticated, async (req, res) => {
    try {
      const userId = req.session.userId;
      const member = await storage.getMemberByUserId(userId!);
      
      if (!member) {
        return res.status(404).json({ success: false, message: 'Member profile not found' });
      }
      
      const employment = await storage.addEmploymentHistory({
        memberId: member.id,
        ...req.body
      });
      
      res.status(201).json({ success: true, employment });
    } catch (error: any) {
      console.error('Add employment history error:', error);
      res.status(500).json({ success: false, message: 'Failed to add employment history', error: error.message });
    }
  });

  // Get member directory
  memberRouter.get('/directory', isAuthenticated, async (req, res) => {
    try {
      const { search, page = 1, limit = 20 } = req.query;
      
      const members = await storage.getMembers(
        search as string | undefined,
        Number(page),
        Number(limit)
      );
      
      res.json({ success: true, members });
    } catch (error: any) {
      console.error('Get member directory error:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch member directory', error: error.message });
    }
  });

  // Get member by ID
  memberRouter.get('/:id', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const member = await storage.getMember(Number(id));
      
      if (!member) {
        return res.status(404).json({ success: false, message: 'Member not found' });
      }
      
      res.json({ success: true, member });
    } catch (error: any) {
      console.error('Get member error:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch member', error: error.message });
    }
  });

  // Subscription routes
  const subscriptionRouter = Router();
  apiRouter.use('/subscriptions', subscriptionRouter);

  // Get subscription status
  subscriptionRouter.get('/status', isAuthenticated, async (req, res) => {
    try {
      const userId = req.session.userId;
      const member = await storage.getMemberByUserId(userId!);
      
      if (!member) {
        return res.status(404).json({ success: false, message: 'Member profile not found' });
      }
      
      const subscription = await storage.getActiveSubscription(member.id);
      
      res.json({ success: true, subscription, status: member.status });
    } catch (error: any) {
      console.error('Get subscription status error:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch subscription status', error: error.message });
    }
  });

  // Get subscription history
  subscriptionRouter.get('/history', isAuthenticated, async (req, res) => {
    try {
      const userId = req.session.userId;
      const member = await storage.getMemberByUserId(userId!);
      
      if (!member) {
        return res.status(404).json({ success: false, message: 'Member profile not found' });
      }
      
      const subscriptions = await storage.getSubscriptionHistory(member.id);
      
      res.json({ success: true, subscriptions });
    } catch (error: any) {
      console.error('Get subscription history error:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch subscription history', error: error.message });
    }
  });

  // Initiate subscription renewal
  subscriptionRouter.post('/renew', isAuthenticated, async (req, res) => {
    try {
      const userId = req.session.userId;
      const member = await storage.getMemberByUserId(userId!);
      
      if (!member) {
        return res.status(404).json({ success: false, message: 'Member profile not found' });
      }
      
      const user = await storage.getUser(userId!);
      
      // Calculate subscription fee based on membership type
      const amount = calculateSubscriptionFee(member.type);
      
      // Generate payment reference
      const reference = generateTransactionReference();
      
      // Initiate payment
      const payment = await initiatePayment(
        user!.email,
        amount,
        reference,
        {
          type: 'subscription',
          memberId: member.id,
          membershipType: member.type
        }
      );
      
      if (!payment.success) {
        return res.status(400).json({ success: false, message: 'Failed to initiate payment', error: payment.error });
      }
      
      // Create transaction record
      await storage.createTransaction({
        memberId: member.id,
        type: 'SUBSCRIPTION',
        amount,
        reference,
        status: 'PENDING',
        description: `Subscription renewal - ${member.type}`
      });
      
      res.json({ success: true, payment: payment.data });
    } catch (error: any) {
      console.error('Subscription renewal error:', error);
      res.status(500).json({ success: false, message: 'Failed to initiate subscription renewal', error: error.message });
    }
  });

  // Payment routes
  const paymentRouter = Router();
  apiRouter.use('/payments', paymentRouter);

  // Verify payment callback
  paymentRouter.get('/verify', async (req, res) => {
    try {
      const { reference } = req.query;
      
      if (!reference) {
        return res.status(400).json({ success: false, message: 'Payment reference is required' });
      }
      
      // Verify payment with Paystack
      const verification = await verifyPayment(reference as string);
      
      if (!verification.success || verification.data?.status !== 'success') {
        return res.status(400).json({ success: false, message: 'Payment verification failed', error: verification.error });
      }
      
      // Get transaction from database
      const transaction = await storage.getTransactionByReference(reference as string);
      
      if (!transaction) {
        return res.status(404).json({ success: false, message: 'Transaction not found' });
      }
      
      // Update transaction status
      await storage.updateTransaction(transaction.id, { status: 'SUCCESS' });
      
      // Process based on transaction type
      const metadata = verification.data.metadata;
      
      if (metadata.type === 'subscription') {
        // Handle subscription payment
        const memberId = metadata.memberId;
        const membershipType = metadata.membershipType;
        
        // Calculate subscription period
        const startDate = new Date();
        const endDate = new Date();
        endDate.setFullYear(endDate.getFullYear() + 1); // 1 year subscription
        
        // Create subscription record
        await storage.createSubscription({
          memberId,
          type: membershipType,
          amount: verification.data.amount,
          startDate,
          endDate,
          paymentId: transaction.id,
          transactionReference: reference as string
        });
        
        // Update member status
        await storage.updateMemberStatus(memberId, 'ACTIVE');
      } else if (metadata.type === 'application') {
        // Handle application payment
        const applicationId = metadata.applicationId;
        
        // Update application status
        await storage.updateApplicationStatus(applicationId, 'APPROVED');
        
        // Generate certificate number and URL
        const certificateNumber = `NITP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
        
        // TODO: Generate actual certificate
        const certificateUrl = ''; // This would be the URL to the generated certificate
        
        // Update application with certificate details
        await storage.updateApplicationCertificate(applicationId, certificateNumber, certificateUrl);
      } else if (metadata.type === 'credits') {
        // Handle credit purchase
        const memberId = metadata.memberId;
        const creditAmount = metadata.credits;
        
        // Add credits to member account
        await storage.addMemberCredits(memberId, creditAmount);
      }
      
      // Redirect to success page
      res.redirect('/payment-success');
    } catch (error: any) {
      console.error('Payment verification error:', error);
      res.status(500).json({ success: false, message: 'Payment verification failed', error: error.message });
    }
  });

  // Application routes
  const applicationRouter = Router();
  apiRouter.use('/applications', applicationRouter);

  // Get applications
  applicationRouter.get('/', isAuthenticated, async (req, res) => {
    try {
      const userId = req.session.userId;
      const member = await storage.getMemberByUserId(userId!);
      
      if (!member) {
        return res.status(404).json({ success: false, message: 'Member profile not found' });
      }
      
      // Check subscription status
      const hasActiveSubscription = await verifyActiveSubscription(userId!);
      
      if (!hasActiveSubscription) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Your subscription has expired. Please renew your subscription to access this feature.'
        });
      }
      
      const applications = await storage.getMemberApplications(member.id);
      
      res.json({ success: true, applications });
    } catch (error: any) {
      console.error('Get applications error:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch applications', error: error.message });
    }
  });

  // Create application
  applicationRouter.post('/', isAuthenticated, async (req, res) => {
    try {
      const userId = req.session.userId;
      const member = await storage.getMemberByUserId(userId!);
      
      if (!member) {
        return res.status(404).json({ success: false, message: 'Member profile not found' });
      }
      
      // Check subscription status
      const hasActiveSubscription = await verifyActiveSubscription(userId!);
      
      if (!hasActiveSubscription) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Your subscription has expired. Please renew your subscription to apply for SAR/EIAR.'
        });
      }
      
      const { applicationType, applicantType, ...applicationData } = req.body;
      
      // Calculate application fee
      const amount = calculateApplicationFee(applicationType, applicantType);
      
      // Create application
      const application = await storage.createApplication({
        memberId: member.id,
        applicationType,
        applicantType,
        amount,
        ...applicationData
      });
      
      res.status(201).json({ success: true, application });
    } catch (error: any) {
      console.error('Create application error:', error);
      res.status(500).json({ success: false, message: 'Failed to create application', error: error.message });
    }
  });

  // Get application by ID
  applicationRouter.get('/:id', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.session.userId;
      const member = await storage.getMemberByUserId(userId!);
      
      if (!member) {
        return res.status(404).json({ success: false, message: 'Member profile not found' });
      }
      
      const application = await storage.getApplication(Number(id));
      
      if (!application) {
        return res.status(404).json({ success: false, message: 'Application not found' });
      }
      
      // Check if application belongs to user or user is admin
      if (application.memberId !== member.id && req.session.user?.role !== 'ADMINISTRATOR') {
        return res.status(403).json({ success: false, message: 'You do not have permission to view this application' });
      }
      
      // Get application documents
      const documents = await storage.getApplicationDocuments(application.id);
      
      res.json({ success: true, application: { ...application, documents } });
    } catch (error: any) {
      console.error('Get application error:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch application', error: error.message });
    }
  });

  // Upload application document
  applicationRouter.post('/:id/documents', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.session.userId;
      const member = await storage.getMemberByUserId(userId!);
      
      if (!member) {
        return res.status(404).json({ success: false, message: 'Member profile not found' });
      }
      
      const application = await storage.getApplication(Number(id));
      
      if (!application) {
        return res.status(404).json({ success: false, message: 'Application not found' });
      }
      
      // Check if application belongs to user
      if (application.memberId !== member.id) {
        return res.status(403).json({ success: false, message: 'You do not have permission to modify this application' });
      }
      
      // TODO: Implement document upload
      const { documentType, documentUrl } = req.body;
      
      const document = await storage.addApplicationDocument({
        applicationId: application.id,
        documentType,
        documentUrl
      });
      
      res.status(201).json({ success: true, document });
    } catch (error: any) {
      console.error('Upload application document error:', error);
      res.status(500).json({ success: false, message: 'Failed to upload document', error: error.message });
    }
  });

  // Submit application for review
  applicationRouter.post('/:id/submit', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.session.userId;
      const member = await storage.getMemberByUserId(userId!);
      
      if (!member) {
        return res.status(404).json({ success: false, message: 'Member profile not found' });
      }
      
      const application = await storage.getApplication(Number(id));
      
      if (!application) {
        return res.status(404).json({ success: false, message: 'Application not found' });
      }
      
      // Check if application belongs to user
      if (application.memberId !== member.id) {
        return res.status(403).json({ success: false, message: 'You do not have permission to submit this application' });
      }
      
      // Check if application is in draft status
      if (application.status !== 'DRAFT') {
        return res.status(400).json({ success: false, message: 'Only draft applications can be submitted' });
      }
      
      // Update application status
      await storage.updateApplicationStatus(application.id, 'SUBMITTED');
      
      res.json({ success: true, message: 'Application submitted successfully' });
    } catch (error: any) {
      console.error('Submit application error:', error);
      res.status(500).json({ success: false, message: 'Failed to submit application', error: error.message });
    }
  });

  // Pay for application
  applicationRouter.post('/:id/pay', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.session.userId;
      const member = await storage.getMemberByUserId(userId!);
      
      if (!member) {
        return res.status(404).json({ success: false, message: 'Member profile not found' });
      }
      
      const application = await storage.getApplication(Number(id));
      
      if (!application) {
        return res.status(404).json({ success: false, message: 'Application not found' });
      }
      
      // Check if application belongs to user
      if (application.memberId !== member.id) {
        return res.status(403).json({ success: false, message: 'You do not have permission to pay for this application' });
      }
      
      // Check if application is in appropriate status
      if (application.status !== 'UNDER_REVIEW') {
        return res.status(400).json({ success: false, message: 'Application is not ready for payment' });
      }
      
      const user = await storage.getUser(userId!);
      
      // Generate payment reference
      const reference = generateTransactionReference();
      
      // Initiate payment
      const payment = await initiatePayment(
        user!.email,
        Number(application.amount),
        reference,
        {
          type: 'application',
          applicationId: application.id,
          applicationType: application.applicationType
        }
      );
      
      if (!payment.success) {
        return res.status(400).json({ success: false, message: 'Failed to initiate payment', error: payment.error });
      }
      
      // Create transaction record
      const transaction = await storage.createTransaction({
        memberId: member.id,
        type: 'APPLICATION_FEE',
        amount: Number(application.amount),
        reference,
        status: 'PENDING',
        description: `Application fee - ${application.applicationType} (${application.applicantType})`
      });
      
      // Update application status and payment ID
      await storage.updateApplication(application.id, {
        status: 'PAYMENT_PENDING',
        paymentId: transaction.id
      });
      
      res.json({ success: true, payment: payment.data });
    } catch (error: any) {
      console.error('Application payment error:', error);
      res.status(500).json({ success: false, message: 'Failed to initiate payment', error: error.message });
    }
  });

  // E-Learning routes
  const learningRouter = Router();
  apiRouter.use('/learning', learningRouter);

  // Get courses
  learningRouter.get('/courses', isAuthenticated, async (req, res) => {
    try {
      const userId = req.session.userId;
      const member = await storage.getMemberByUserId(userId!);
      
      if (!member) {
        return res.status(404).json({ success: false, message: 'Member profile not found' });
      }
      
      // Check subscription status
      const hasActiveSubscription = await verifyActiveSubscription(userId!);
      
      if (!hasActiveSubscription) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Your subscription has expired. Please renew your subscription to access E-Learning resources.'
        });
      }
      
      const courses = await storage.getCourses();
      
      res.json({ success: true, courses });
    } catch (error: any) {
      console.error('Get courses error:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch courses', error: error.message });
    }
  });

  // Get course by ID
  learningRouter.get('/courses/:id', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.session.userId;
      const member = await storage.getMemberByUserId(userId!);
      
      if (!member) {
        return res.status(404).json({ success: false, message: 'Member profile not found' });
      }
      
      // Check subscription status
      const hasActiveSubscription = await verifyActiveSubscription(userId!);
      
      if (!hasActiveSubscription) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Your subscription has expired. Please renew your subscription to access E-Learning resources.'
        });
      }
      
      const course = await storage.getCourse(Number(id));
      
      if (!course) {
        return res.status(404).json({ success: false, message: 'Course not found' });
      }
      
      res.json({ success: true, course });
    } catch (error: any) {
      console.error('Get course error:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch course', error: error.message });
    }
  });

  // Enroll in course
  learningRouter.post('/courses/:id/enroll', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.session.userId;
      const member = await storage.getMemberByUserId(userId!);
      
      if (!member) {
        return res.status(404).json({ success: false, message: 'Member profile not found' });
      }
      
      // Check subscription status
      const hasActiveSubscription = await verifyActiveSubscription(userId!);
      
      if (!hasActiveSubscription) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Your subscription has expired. Please renew your subscription to enroll in courses.'
        });
      }
      
      const course = await storage.getCourse(Number(id));
      
      if (!course) {
        return res.status(404).json({ success: false, message: 'Course not found' });
      }
      
      // Check if already enrolled
      const existingEnrollment = await storage.getEnrollment(member.id, course.id);
      
      if (existingEnrollment) {
        return res.status(400).json({ success: false, message: 'You are already enrolled in this course' });
      }
      
      // Create enrollment
      const enrollment = await storage.createEnrollment({
        memberId: member.id,
        courseId: course.id
      });
      
      res.status(201).json({ success: true, enrollment });
    } catch (error: any) {
      console.error('Course enrollment error:', error);
      res.status(500).json({ success: false, message: 'Failed to enroll in course', error: error.message });
    }
  });

  // Get member enrollments
  learningRouter.get('/enrollments', isAuthenticated, async (req, res) => {
    try {
      const userId = req.session.userId;
      const member = await storage.getMemberByUserId(userId!);
      
      if (!member) {
        return res.status(404).json({ success: false, message: 'Member profile not found' });
      }
      
      const enrollments = await storage.getMemberEnrollments(member.id);
      
      res.json({ success: true, enrollments });
    } catch (error: any) {
      console.error('Get enrollments error:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch enrollments', error: error.message });
    }
  });

  // Update course progress
  learningRouter.post('/enrollments/:id/progress', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const { moduleIndex, completed } = req.body;
      const userId = req.session.userId;
      const member = await storage.getMemberByUserId(userId!);
      
      if (!member) {
        return res.status(404).json({ success: false, message: 'Member profile not found' });
      }
      
      const enrollment = await storage.getEnrollmentById(Number(id));
      
      if (!enrollment) {
        return res.status(404).json({ success: false, message: 'Enrollment not found' });
      }
      
      // Check if enrollment belongs to user
      if (enrollment.memberId !== member.id) {
        return res.status(403).json({ success: false, message: 'You do not have permission to update this enrollment' });
      }
      
      // Get course to check total modules
      const course = await storage.getCourse(enrollment.courseId);
      
      if (!course) {
        return res.status(404).json({ success: false, message: 'Course not found' });
      }
      
      // Calculate new progress
      let completedModules = enrollment.completedModules;
      if (completed && moduleIndex >= 0 && moduleIndex < course.modules) {
        completedModules += 1;
      }
      
      const progress = Math.round((completedModules / course.modules) * 100);
      
      // Update enrollment
      const updatedEnrollment = await storage.updateEnrollment(enrollment.id, {
        progress,
        completedModules
      });
      
      // Check if course completed
      if (completedModules >= course.modules) {
        await storage.updateEnrollment(enrollment.id, {
          completionDate: new Date()
        });
      }
      
      res.json({ success: true, enrollment: updatedEnrollment });
    } catch (error: any) {
      console.error('Update progress error:', error);
      res.status(500).json({ success: false, message: 'Failed to update progress', error: error.message });
    }
  });

  // Member tools routes
  const toolsRouter = Router();
  apiRouter.use('/tools', toolsRouter);

  // Get tools
  toolsRouter.get('/', isAuthenticated, async (req, res) => {
    try {
      const userId = req.session.userId;
      const member = await storage.getMemberByUserId(userId!);
      
      if (!member) {
        return res.status(404).json({ success: false, message: 'Member profile not found' });
      }
      
      // Check subscription status
      const hasActiveSubscription = await verifyActiveSubscription(userId!);
      
      if (!hasActiveSubscription) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Your subscription has expired. Please renew your subscription to access Member Tools.'
        });
      }
      
      const tools = await storage.getTools();
      
      res.json({ success: true, tools, memberCredits: member.credits });
    } catch (error: any) {
      console.error('Get tools error:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch tools', error: error.message });
    }
  });

  // Use tool
  toolsRouter.post('/:id/use', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.session.userId;
      const member = await storage.getMemberByUserId(userId!);
      
      if (!member) {
        return res.status(404).json({ success: false, message: 'Member profile not found' });
      }
      
      // Check subscription status
      const hasActiveSubscription = await verifyActiveSubscription(userId!);
      
      if (!hasActiveSubscription) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Your subscription has expired. Please renew your subscription to use Member Tools.'
        });
      }
      
      const tool = await storage.getTool(Number(id));
      
      if (!tool) {
        return res.status(404).json({ success: false, message: 'Tool not found' });
      }
      
      // Check if member has enough credits
      if (member.credits < tool.creditCost) {
        return res.status(400).json({
          success: false,
          message: `Insufficient credits. You need ${tool.creditCost} credits to use this tool. Your current balance is ${member.credits} credits.`
        });
      }
      
      // Deduct credits
      await storage.updateMemberCredits(member.id, member.credits - tool.creditCost);
      
      // Record tool usage
      const usage = await storage.recordToolUsage({
        memberId: member.id,
        toolId: tool.id,
        creditsUsed: tool.creditCost
      });
      
      res.json({
        success: true,
        message: `${tool.creditCost} credits have been deducted from your account.`,
        remainingCredits: member.credits - tool.creditCost,
        usage
      });
    } catch (error: any) {
      console.error('Use tool error:', error);
      res.status(500).json({ success: false, message: 'Failed to use tool', error: error.message });
    }
  });

  // Buy credits
  toolsRouter.post('/credits/buy', isAuthenticated, async (req, res) => {
    try {
      const { amount } = req.body;
      const userId = req.session.userId;
      const member = await storage.getMemberByUserId(userId!);
      
      if (!member) {
        return res.status(404).json({ success: false, message: 'Member profile not found' });
      }
      
      const user = await storage.getUser(userId!);
      
      // Convert Naira to credits
      const credits = nairaToCredits(Number(amount));
      
      // Generate payment reference
      const reference = generateTransactionReference();
      
      // Initiate payment
      const payment = await initiatePayment(
        user!.email,
        Number(amount),
        reference,
        {
          type: 'credits',
          memberId: member.id,
          credits
        }
      );
      
      if (!payment.success) {
        return res.status(400).json({ success: false, message: 'Failed to initiate payment', error: payment.error });
      }
      
      // Create transaction record
      await storage.createTransaction({
        memberId: member.id,
        type: 'CREDIT_PURCHASE',
        amount: Number(amount),
        reference,
        status: 'PENDING',
        description: `Credit purchase - ${credits} credits`
      });
      
      res.json({ success: true, payment: payment.data });
    } catch (error: any) {
      console.error('Buy credits error:', error);
      res.status(500).json({ success: false, message: 'Failed to initiate credit purchase', error: error.message });
    }
  });

  // Chat routes
  const chatRouter = Router();
  apiRouter.use('/chat', chatRouter);

  // Get chat rooms
  chatRouter.get('/rooms', isAuthenticated, async (req, res) => {
    try {
      const rooms = await storage.getChatRooms();
      res.json({ success: true, rooms });
    } catch (error: any) {
      console.error('Get chat rooms error:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch chat rooms', error: error.message });
    }
  });

  // Create chat room
  chatRouter.post('/rooms', isAuthenticated, async (req, res) => {
    try {
      const { name, description, isPrivate } = req.body;
      const userId = req.session.userId;
      const member = await storage.getMemberByUserId(userId!);
      
      if (!member) {
        return res.status(404).json({ success: false, message: 'Member profile not found' });
      }
      
      const room = await storage.createChatRoom({
        name,
        description,
        isPrivate: isPrivate || false,
        createdBy: member.id,
        isApproved: req.session.user?.role === 'ADMINISTRATOR' // Auto-approve if admin creates it
      });
      
      // Add creator as participant
      await storage.addRoomParticipant({
        roomId: room.id,
        memberId: member.id
      });
      
      res.status(201).json({ success: true, room });
    } catch (error: any) {
      console.error('Create chat room error:', error);
      res.status(500).json({ success: false, message: 'Failed to create chat room', error: error.message });
    }
  });

  // Get room messages
  chatRouter.get('/rooms/:id/messages', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.session.userId;
      const member = await storage.getMemberByUserId(userId!);
      
      if (!member) {
        return res.status(404).json({ success: false, message: 'Member profile not found' });
      }
      
      const room = await storage.getChatRoom(Number(id));
      
      if (!room) {
        return res.status(404).json({ success: false, message: 'Chat room not found' });
      }
      
      // Check if private room and user is a participant
      if (room.isPrivate) {
        const isParticipant = await storage.isRoomParticipant(room.id, member.id);
        
        if (!isParticipant && req.session.user?.role !== 'ADMINISTRATOR') {
          return res.status(403).json({ success: false, message: 'You do not have permission to view this chat room' });
        }
      }
      
      const messages = await storage.getRoomMessages(room.id);
      
      res.json({ success: true, messages });
    } catch (error: any) {
      console.error('Get room messages error:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch room messages', error: error.message });
    }
  });

  // Join chat room
  chatRouter.post('/rooms/:id/join', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.session.userId;
      const member = await storage.getMemberByUserId(userId!);
      
      if (!member) {
        return res.status(404).json({ success: false, message: 'Member profile not found' });
      }
      
      const room = await storage.getChatRoom(Number(id));
      
      if (!room) {
        return res.status(404).json({ success: false, message: 'Chat room not found' });
      }
      
      // Check if user is already a participant
      const isParticipant = await storage.isRoomParticipant(room.id, member.id);
      
      if (isParticipant) {
        return res.status(400).json({ success: false, message: 'You are already a participant in this room' });
      }
      
      // Check if room is approved
      if (!room.isApproved) {
        return res.status(400).json({ success: false, message: 'This chat room is pending approval' });
      }
      
      // Add user as participant
      await storage.addRoomParticipant({
        roomId: room.id,
        memberId: member.id
      });
      
      res.json({ success: true, message: 'You have joined the chat room' });
    } catch (error: any) {
      console.error('Join chat room error:', error);
      res.status(500).json({ success: false, message: 'Failed to join chat room', error: error.message });
    }
  });

  // Get direct messages
  chatRouter.get('/direct/:memberId', isAuthenticated, async (req, res) => {
    try {
      const { memberId } = req.params;
      const userId = req.session.userId;
      const member = await storage.getMemberByUserId(userId!);
      
      if (!member) {
        return res.status(404).json({ success: false, message: 'Member profile not found' });
      }
      
      const otherMember = await storage.getMember(Number(memberId));
      
      if (!otherMember) {
        return res.status(404).json({ success: false, message: 'Member not found' });
      }
      
      const messages = await storage.getDirectMessages(member.id, otherMember.id);
      
      res.json({ success: true, messages });
    } catch (error: any) {
      console.error('Get direct messages error:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch direct messages', error: error.message });
    }
  });

  // Get recent conversations
  chatRouter.get('/conversations', isAuthenticated, async (req, res) => {
    try {
      const userId = req.session.userId;
      const member = await storage.getMemberByUserId(userId!);
      
      if (!member) {
        return res.status(404).json({ success: false, message: 'Member profile not found' });
      }
      
      const conversations = await storage.getRecentConversations(member.id);
      
      res.json({ success: true, conversations });
    } catch (error: any) {
      console.error('Get conversations error:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch conversations', error: error.message });
    }
  });

  // Elections routes
  const electionsRouter = Router();
  apiRouter.use('/elections', electionsRouter);

  // Get elections
  electionsRouter.get('/', isAuthenticated, async (req, res) => {
    try {
      const elections = await storage.getElections();
      res.json({ success: true, elections });
    } catch (error: any) {
      console.error('Get elections error:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch elections', error: error.message });
    }
  });

  // Get election by ID
  electionsRouter.get('/:id', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const election = await storage.getElection(Number(id));
      
      if (!election) {
        return res.status(404).json({ success: false, message: 'Election not found' });
      }
      
      const positions = await storage.getElectionPositions(election.id);
      
      // Get candidates for each position
      for (const position of positions) {
        position.candidates = await storage.getPositionCandidates(position.id);
      }
      
      res.json({ success: true, election: { ...election, positions } });
    } catch (error: any) {
      console.error('Get election error:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch election', error: error.message });
    }
  });

  // Apply for candidacy
  electionsRouter.post('/:id/positions/:positionId/apply', isAuthenticated, async (req, res) => {
    try {
      const { id, positionId } = req.params;
      const { bio, manifesto } = req.body;
      const userId = req.session.userId;
      const member = await storage.getMemberByUserId(userId!);
      
      if (!member) {
        return res.status(404).json({ success: false, message: 'Member profile not found' });
      }
      
      const election = await storage.getElection(Number(id));
      
      if (!election) {
        return res.status(404).json({ success: false, message: 'Election not found' });
      }
      
      const position = await storage.getElectionPosition(Number(positionId));
      
      if (!position) {
        return res.status(404).json({ success: false, message: 'Position not found' });
      }
      
      // Check if election is in nomination phase
      if (election.status !== 'NOMINATIONS') {
        return res.status(400).json({ success: false, message: 'Election is not in the nomination phase' });
      }
      
      // Check if user has already applied for this position
      const existingCandidate = await storage.getCandidateByMember(election.id, position.id, member.id);
      
      if (existingCandidate) {
        return res.status(400).json({ success: false, message: 'You have already applied for this position' });
      }
      
      // Create candidate
      const candidate = await storage.createCandidate({
        electionId: election.id,
        positionId: position.id,
        memberId: member.id,
        bio,
        manifesto
      });
      
      res.status(201).json({ success: true, candidate });
    } catch (error: any) {
      console.error('Apply for candidacy error:', error);
      res.status(500).json({ success: false, message: 'Failed to apply for candidacy', error: error.message });
    }
  });

  // Vote for candidate
  electionsRouter.post('/:id/positions/:positionId/vote', isAuthenticated, async (req, res) => {
    try {
      const { id, positionId } = req.params;
      const { candidateId } = req.body;
      const userId = req.session.userId;
      const member = await storage.getMemberByUserId(userId!);
      
      if (!member) {
        return res.status(404).json({ success: false, message: 'Member profile not found' });
      }
      
      const election = await storage.getElection(Number(id));
      
      if (!election) {
        return res.status(404).json({ success: false, message: 'Election not found' });
      }
      
      const position = await storage.getElectionPosition(Number(positionId));
      
      if (!position) {
        return res.status(404).json({ success: false, message: 'Position not found' });
      }
      
      const candidate = await storage.getCandidate(Number(candidateId));
      
      if (!candidate) {
        return res.status(404).json({ success: false, message: 'Candidate not found' });
      }
      
      // Check if election is in voting phase
      if (election.status !== 'VOTING') {
        return res.status(400).json({ success: false, message: 'Election is not in the voting phase' });
      }
      
      // Check if user has already voted for this position
      const existingVote = await storage.getVote(election.id, position.id, member.id);
      
      if (existingVote) {
        return res.status(400).json({ success: false, message: 'You have already voted for this position' });
      }
      
      // Record vote
      const vote = await storage.recordVote({
        electionId: election.id,
        positionId: position.id,
        candidateId: candidate.id,
        voterId: member.id,
        ipAddress: req.ip
      });
      
      // Emit vote update via Socket.IO
      io.emit('election:vote:update', {
        electionId: election.id,
        positionId: position.id,
        candidateId: candidate.id
      });
      
      res.status(201).json({ success: true, message: 'Vote recorded successfully' });
    } catch (error: any) {
      console.error('Vote error:', error);
      res.status(500).json({ success: false, message: 'Failed to record vote', error: error.message });
    }
  });

  // Get election results
  electionsRouter.get('/:id/results', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const election = await storage.getElection(Number(id));
      
      if (!election) {
        return res.status(404).json({ success: false, message: 'Election not found' });
      }
      
      // Check if election is closed
      if (election.status !== 'CLOSED' && req.session.user?.role !== 'ADMINISTRATOR') {
        return res.status(400).json({ success: false, message: 'Election results are not available yet' });
      }
      
      const positions = await storage.getElectionPositions(election.id);
      const results = [];
      
      // Get candidates and vote counts for each position
      for (const position of positions) {
        const candidates = await storage.getPositionCandidates(position.id);
        
        for (const candidate of candidates) {
          const voteCount = await storage.getCandidateVotes(election.id, position.id, candidate.id);
          candidate.voteCount = voteCount;
        }
        
        results.push({
          position,
          candidates: candidates.sort((a, b) => (b.voteCount || 0) - (a.voteCount || 0))
        });
      }
      
      res.json({ success: true, election, results });
    } catch (error: any) {
      console.error('Get election results error:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch election results', error: error.message });
    }
  });

  // Ethics routes
  const ethicsRouter = Router();
  apiRouter.use('/ethics', ethicsRouter);

  // Submit complaint
  ethicsRouter.post('/complaints', async (req, res) => {
    try {
      const { subject, details, complainantName, complainantEmail } = req.body;
      
      const complaint = await storage.createComplaint({
        subject,
        details,
        complainantName,
        complainantEmail
      });
      
      res.status(201).json({ success: true, message: 'Complaint submitted successfully', complaintId: complaint.id });
    } catch (error: any) {
      console.error('Submit complaint error:', error);
      res.status(500).json({ success: false, message: 'Failed to submit complaint', error: error.message });
    }
  });

  // Get complaints (admin/ethics officer only)
  ethicsRouter.get('/complaints', isAuthenticated, hasRole(['ADMINISTRATOR', 'ETHICS_OFFICER']), async (req, res) => {
    try {
      const complaints = await storage.getComplaints();
      res.json({ success: true, complaints });
    } catch (error: any) {
      console.error('Get complaints error:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch complaints', error: error.message });
    }
  });

  // Get complaint by ID (admin/ethics officer only)
  ethicsRouter.get('/complaints/:id', isAuthenticated, hasRole(['ADMINISTRATOR', 'ETHICS_OFFICER']), async (req, res) => {
    try {
      const { id } = req.params;
      const complaint = await storage.getComplaint(Number(id));
      
      if (!complaint) {
        return res.status(404).json({ success: false, message: 'Complaint not found' });
      }
      
      const attachments = await storage.getComplaintAttachments(complaint.id);
      
      res.json({ success: true, complaint: { ...complaint, attachments } });
    } catch (error: any) {
      console.error('Get complaint error:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch complaint', error: error.message });
    }
  });

  // Update complaint status (admin/ethics officer only)
  ethicsRouter.patch('/complaints/:id/status', isAuthenticated, hasRole(['ADMINISTRATOR', 'ETHICS_OFFICER']), async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const userId = req.session.userId;
      
      const complaint = await storage.getComplaint(Number(id));
      
      if (!complaint) {
        return res.status(404).json({ success: false, message: 'Complaint not found' });
      }
      
      await storage.updateComplaintStatus(complaint.id, status);
      
      res.json({ success: true, message: 'Complaint status updated successfully' });
    } catch (error: any) {
      console.error('Update complaint status error:', error);
      res.status(500).json({ success: false, message: 'Failed to update complaint status', error: error.message });
    }
  });

  // Assign complaint (admin/ethics officer only)
  ethicsRouter.patch('/complaints/:id/assign', isAuthenticated, hasRole(['ADMINISTRATOR', 'ETHICS_OFFICER']), async (req, res) => {
    try {
      const { id } = req.params;
      const { ethicsOfficerId } = req.body;
      
      const complaint = await storage.getComplaint(Number(id));
      
      if (!complaint) {
        return res.status(404).json({ success: false, message: 'Complaint not found' });
      }
      
      await storage.assignComplaint(complaint.id, Number(ethicsOfficerId));
      
      res.json({ success: true, message: 'Complaint assigned successfully' });
    } catch (error: any) {
      console.error('Assign complaint error:', error);
      res.status(500).json({ success: false, message: 'Failed to assign complaint', error: error.message });
    }
  });

  // Issue sanction (admin/ethics officer only)
  ethicsRouter.post('/complaints/:id/sanctions', isAuthenticated, hasRole(['ADMINISTRATOR', 'ETHICS_OFFICER']), async (req, res) => {
    try {
      const { id } = req.params;
      const { memberId, sanctionType, description, startDate, endDate, amount } = req.body;
      const userId = req.session.userId;
      
      const complaint = await storage.getComplaint(Number(id));
      
      if (!complaint) {
        return res.status(404).json({ success: false, message: 'Complaint not found' });
      }
      
      const sanction = await storage.createSanction({
        complaintId: complaint.id,
        memberId: Number(memberId),
        sanctionType,
        description,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : undefined,
        amount,
        issuedBy: userId!
      });
      
      // If suspension, update member status
      if (sanctionType === 'SUSPENSION') {
        await storage.updateMemberStatus(Number(memberId), 'SUSPENDED');
      }
      
      res.status(201).json({ success: true, sanction });
    } catch (error: any) {
      console.error('Issue sanction error:', error);
      res.status(500).json({ success: false, message: 'Failed to issue sanction', error: error.message });
    }
  });

  // Appeal sanction
  ethicsRouter.post('/sanctions/:id/appeal', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      const userId = req.session.userId;
      const member = await storage.getMemberByUserId(userId!);
      
      if (!member) {
        return res.status(404).json({ success: false, message: 'Member profile not found' });
      }
      
      const sanction = await storage.getSanction(Number(id));
      
      if (!sanction) {
        return res.status(404).json({ success: false, message: 'Sanction not found' });
      }
      
      // Check if sanction belongs to user
      if (sanction.memberId !== member.id) {
        return res.status(403).json({ success: false, message: 'You do not have permission to appeal this sanction' });
      }
      
      // Check if already appealed
      const existingAppeal = await storage.getAppealBySanction(sanction.id);
      
      if (existingAppeal) {
        return res.status(400).json({ success: false, message: 'You have already appealed this sanction' });
      }
      
      const appeal = await storage.createAppeal({
        sanctionId: sanction.id,
        reason
      });
      
      res.status(201).json({ success: true, appeal });
    } catch (error: any) {
      console.error('Appeal sanction error:', error);
      res.status(500).json({ success: false, message: 'Failed to appeal sanction', error: error.message });
    }
  });

  // Content routes
  const contentRouter = Router();
  apiRouter.use('/content', contentRouter);

  // Get announcements
  contentRouter.get('/announcements', async (req, res) => {
    try {
      const announcements = await storage.getPublishedAnnouncements();
      res.json({ success: true, announcements });
    } catch (error: any) {
      console.error('Get announcements error:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch announcements', error: error.message });
    }
  });

  // Get events
  contentRouter.get('/events', async (req, res) => {
    try {
      const events = await storage.getUpcomingEvents();
      res.json({ success: true, events });
    } catch (error: any) {
      console.error('Get events error:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch events', error: error.message });
    }
  });

  // Get news
  contentRouter.get('/news', async (req, res) => {
    try {
      const news = await storage.getPublishedNews();
      res.json({ success: true, news });
    } catch (error: any) {
      console.error('Get news error:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch news', error: error.message });
    }
  });

  // Get news article by ID
  contentRouter.get('/news/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const article = await storage.getNewsArticle(Number(id));
      
      if (!article) {
        return res.status(404).json({ success: false, message: 'News article not found' });
      }
      
      res.json({ success: true, article });
    } catch (error: any) {
      console.error('Get news article error:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch news article', error: error.message });
    }
  });

  // Register for event
  contentRouter.post('/events/:id/register', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.session.userId;
      const member = await storage.getMemberByUserId(userId!);
      
      if (!member) {
        return res.status(404).json({ success: false, message: 'Member profile not found' });
      }
      
      const event = await storage.getEvent(Number(id));
      
      if (!event) {
        return res.status(404).json({ success: false, message: 'Event not found' });
      }
      
      // Check if already registered
      const existingRegistration = await storage.getEventRegistration(event.id, member.id);
      
      if (existingRegistration) {
        return res.status(400).json({ success: false, message: 'You are already registered for this event' });
      }
      
      const registration = await storage.registerForEvent({
        eventId: event.id,
        memberId: member.id
      });
      
      res.status(201).json({ success: true, registration });
    } catch (error: any) {
      console.error('Register for event error:', error);
      res.status(500).json({ success: false, message: 'Failed to register for event', error: error.message });
    }
  });

  return httpServer;
}
