import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../Store/authStore';
import { normalizeRole } from '@/lib/auth';

export const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, user } = useAuthStore();
  const role = normalizeRole(user?.role);

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  if (allowedRoles && !allowedRoles.map(normalizeRole).includes(role)) {
     return <Navigate to="/" replace />; // Or to a forbidden page
  }

  return <Outlet />;
};
