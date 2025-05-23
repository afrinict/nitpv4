import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocation } from 'wouter';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  membershipId?: string;
  isVerified: boolean;
}

interface Member {
  id: number;
  firstName: string;
  lastName: string;
  type: string;
  status: string;
  profilePicture?: string;
  credits: number;
  [key: string]: any;
}

interface AuthContextType {
  user: { user: User; member?: Member } | null;
  loading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ user: User; member?: Member } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [, setLocation] = useLocation();

  // Check if user is authenticated on initial load
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async (): Promise<boolean> => {
    try {
      setLoading(true);
      // We'll use a simpler mechanism for now
      const userData = localStorage.getItem('nitp_user');
      if (userData) {
        setUser(JSON.parse(userData));
        setLoading(false);
        return true;
      }
      setUser(null);
      setLoading(false);
      return false;
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
      setLoading(false);
      return false;
    }
  };

  const login = async (identifier: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      // For demo purposes, we'll simulate a successful login
      // In a real app, this would make an API request
      const demoUser = {
        user: {
          id: 1,
          username: identifier,
          email: `${identifier}@example.com`,
          role: "MEMBER",
          membershipId: "TP-A32100001",
          isVerified: true
        },
        member: {
          id: 1,
          firstName: "John",
          lastName: "Doe",
          type: "PROFESSIONAL",
          status: "ACTIVE",
          credits: 5000
        }
      };
      
      // Store in localStorage for persistence
      localStorage.setItem('nitp_user', JSON.stringify(demoUser));
      setUser(demoUser);
      setLoading(false);
      
      // Redirect to dashboard
      setLocation('/dashboard');
    } catch (error: any) {
      setLoading(false);
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      // Clear local storage
      localStorage.removeItem('nitp_user');
      setUser(null);
      
      // Redirect to home
      setLocation('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}