import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { ExtendedUser, UserRole } from '@/types/user';

interface AuthContextType {
  user: ExtendedUser | null;
  setUser: (user: ExtendedUser | null) => void;
  loading: boolean;
  isAuthenticated: boolean;
  hasRole: (role: UserRole) => boolean;
  logout: () => void;
  login: (identifier: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  loading: true,
  isAuthenticated: false,
  hasRole: () => false,
  logout: () => {},
  login: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;
  const hasRole = (role: UserRole) => user?.role === role;
  
  const login = async (identifier: string, password: string) => {
    try {
      const response = await api.post('/api/auth/login', { identifier, password });
      const { user: userData } = response.data;
      
      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);

      // Redirect based on user role
      if (userData.role === 'ADMINISTRATOR') {
        window.location.href = '/admin/dashboard';
      } else if (userData.role === 'ETHICS_OFFICER') {
        window.location.href = '/ethics-dashboard';
      } else if (userData.role === 'FINANCIAL_ADMINISTRATOR' || userData.role === 'FINANCIAL_OFFICER') {
        window.location.href = '/finance-dashboard';
      } else {
        window.location.href = '/dashboard';
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = localStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, isAuthenticated, hasRole, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
};