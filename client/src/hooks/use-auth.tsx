import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
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
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();
  const [location, setLocation] = useLocation();

  // Check if user is authenticated on initial load
  useEffect(() => {
    checkAuth().finally(() => setLoading(false));
  }, []);

  const checkAuth = async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUser({
            user: data.user,
            member: data.member,
          });
          return true;
        }
      }
      setUser(null);
      return false;
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
      return false;
    }
  };

  const login = async (identifier: string, password: string): Promise<void> => {
    try {
      const response = await apiRequest('POST', '/api/auth/login', {
        identifier,
        password,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      setUser({
        user: data.user,
        member: data.member,
      });

      // Redirect to dashboard
      setLocation('/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await apiRequest('POST', '/api/auth/logout', {});
      setUser(null);
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
      });
      setLocation('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: 'Logout Failed',
        description: 'There was an issue logging out. Please try again.',
        variant: 'destructive',
      });
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