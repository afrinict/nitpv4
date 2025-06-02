import express, { Router, Request, Response } from "express";
import session from "express-session";
import MemoryStore from "memorystore";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { createServer, type Server } from "http";
import { storage } from "./src/storage";
import { setupSocketServer } from "./src/socket";
import { 
  isAuthenticated, 
  hasRole, 
  hashPassword, 
  comparePassword, 
  generateToken, 
  loginUser, 
  logoutUser, 
  generateMembershipId, 
  calculateSubscriptionFee, 
  calculateApplicationFee, 
  verifyActiveSubscription 
} from "./src/auth";
import { membershipTypeEnum, loginSchema, users, members } from "@shared/schema";
import { AuthUser } from "@shared/types";
import { uploadToStorage } from "./src/utils/storage";
import { sendEmail, sendSMS } from "./src/utils/notification";
import { redisClient } from "./src/utils/redis";
import { PrismaClient } from '@prisma/client';
import { upload } from './src/utils/storage';
import { generateAndStoreOTP, verifyOTP, clearOTP } from './src/utils/redis';
import { registerRoutes as registerAuthRoutes } from './src/auth';

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

  // Register routes
  registerAuthRoutes(authRouter);

  return httpServer;
}
