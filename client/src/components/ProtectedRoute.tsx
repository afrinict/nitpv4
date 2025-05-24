import React from 'react';
import { Redirect } from 'wouter';
import { useAuth, UserRole } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  component: React.FC;
  roles?: UserRole | UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  component: Component, 
  roles 
}) => {
  const { isAuthenticated, isLoading, hasRole } = useAuth();

  // Show loading state while authentication is being checked
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  // Check role permissions if roles are specified
  if (roles && !hasRole(roles)) {
    return <Redirect to="/unauthorized" />;
  }

  // Render the protected component
  return <Component />;
};

export default ProtectedRoute;