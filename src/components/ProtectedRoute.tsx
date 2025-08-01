// ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthenticator } from '@aws-amplify/ui-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  /* TW:
  const { authStatus } = useAuthenticator();
  
  // Check if user is authenticated using Amplify auth
  const isAuthenticated = authStatus === 'authenticated';

  if (!isAuthenticated) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" replace />;
  }
  */
  return <>{children}</>;
};

export default ProtectedRoute; 