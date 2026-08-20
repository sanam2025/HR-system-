import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { currentUser, token } = useAuthStore();
  const location = useLocation();

  if (!token || !currentUser) {
    // Not logged in, redirect to login page with the return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const userRole = currentUser.role?.toLowerCase() || '';
  
  const hasAccess = allowedRoles.some(role => userRole.includes(role.toLowerCase()));

  if (!hasAccess) {
    // Role not authorized, redirect to their home page
    if (userRole.includes('admin') || userRole.includes('ceo')) {
      return <Navigate to="/admin" replace />;
    } else if (userRole.includes('hr')) {
      return <Navigate to="/Hr" replace />;
    } else if (userRole.includes('manager')) {
      return <Navigate to="/manager" replace />;
    } else {
      return <Navigate to="/employee" replace />;
    }
  }

  return <>{children}</>;
};
