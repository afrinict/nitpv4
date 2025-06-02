import { Request, Response, NextFunction, Router } from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { users } from '../shared/schema';
import { storage } from './storage';
import { AuthUser } from '../shared/types';

// Function to hash passwords
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

// Function to compare password with hash
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Generate verification token
export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Add user to session
export function loginUser(req: Request, userId: number, user: AuthUser): void {
  req.session.userId = userId;
  req.session.user = user;
}

// Remove user from session
export function logoutUser(req: Request): void {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
    }
  });
}

// Authentication middleware
export function isAuthenticated(req: Request, res: Response, next: NextFunction): void {
  if (req.session.userId) {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
}

// Role-based access control middleware
export function hasRole(roles: string | string[]) {
  const allowedRoles = Array.isArray(roles) ? roles : [roles];
  
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const userRole = req.session.user.role;
    
    if (allowedRoles.includes(userRole)) {
      next();
    } else {
      res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }
  };
}

// Generate membership ID
export function generateMembershipId(type: string): string {
  const prefix = 'TP-A';
  const randomNumbers = Math.floor(10000000 + Math.random() * 90000000).toString();
  return `${prefix}${randomNumbers}`;
}

// Calculate subscription fee based on membership type
export function calculateSubscriptionFee(membershipType: string): number {
  switch (membershipType.toUpperCase()) {
    case 'STUDENT':
      return 10000;
    case 'ASSOCIATE':
      return 25000;
    case 'PROFESSIONAL':
      return 50000;
    case 'FELLOW':
      return 90000;
    default:
      return 0;
  }
}

// Calculate application fee
export function calculateApplicationFee(applicationType: string, applicantType: string): number {
  const adminFee = 5200;
  
  if (applicationType === 'SAR') {
    if (applicantType === 'INDIVIDUAL') {
      return 25000 + adminFee;
    } else if (applicantType === 'CORPORATE') {
      return 45000 + adminFee;
    }
  }
  
  // Default EIAR fees (to be defined)
  return 0;
}

// Verify membership status is active
export async function verifyActiveSubscription(userId: number): Promise<boolean> {
  try {
    const activeSubscription = await storage.getActiveSubscription(userId);
    return !!activeSubscription;
  } catch (error) {
    console.error('Error verifying subscription:', error);
    return false;
  }
}

// Convert credits to Naira
export function creditsToNaira(credits: number): number {
  // 1 Naira = 6 Credits
  return credits / 6;
}

// Convert Naira to credits
export function nairaToCredits(naira: number): number {
  // 1 Naira = 6 Credits
  return naira * 6;
}

// Register authentication routes
export function registerRoutes(router: Router): void {
  // Login route
  router.post('/login', async (req: Request, res: Response) => {
    try {
      const { identifier, password } = req.body;
      const user = await storage.getUserByIdentifier(identifier);
      
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
      
      const isPasswordValid = await comparePassword(password, user.password);
      
      if (!isPasswordValid) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
      
      // Update last login time
      await storage.updateUserLastLogin(user.id);
      
      // Add user to session
      loginUser(req, user.id, {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        membershipId: user.membershipId,
        isVerified: user.isVerified
      });
      
      res.json({ success: true, user: req.session.user });
    } catch (error: any) {
      console.error('Login error:', error);
      res.status(500).json({ success: false, message: 'Login failed', error: error.message });
    }
  });

  // Logout route
  router.post('/logout', (req: Request, res: Response) => {
    logoutUser(req);
    res.json({ success: true, message: 'Logged out successfully' });
  });
}
