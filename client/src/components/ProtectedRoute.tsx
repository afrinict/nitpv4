import React from 'react';
import { Route, Redirect, RouteProps } from 'wouter';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '@/types/user';

interface ProtectedRouteProps extends RouteProps {
  component: React.ComponentType<any>;
  roles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  component: Component,
  roles,
  ...rest
}) => {
  const { isAuthenticated, hasRole } = useAuth();

  return (
    <Route
      {...rest}
      component={(props: any) => {
        // Check if user is authenticated
        if (!isAuthenticated) {
          // Redirect to login if not authenticated
          return <Redirect to="/login" />;
        }

        // Check if user has required role
        if (roles && !roles.some(role => hasRole(role))) {
          // Redirect to unauthorized page if user doesn't have required role
          return <Redirect to="/unauthorized" />;
        }

        // Render the protected component
        return <Component {...props} />;
      }}
    />
  );
};

export default ProtectedRoute;