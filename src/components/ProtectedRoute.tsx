import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
export function ProtectedRoute({
  children
}: {
  children: React.ReactNode;
}) {
  const {
    isAuthenticated,
    user
  } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{
      from: location
    }} replace />;
  }

  // Check for staff roles specifically for these protected routes
  if (user?.role === 'visitor') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}