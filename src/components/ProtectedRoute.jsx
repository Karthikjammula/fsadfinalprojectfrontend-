import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // If role is not allowed, redirect to a default dashboard or auth page
    if (role === 'ADMIN') return <Navigate to="/admin" replace />;
    if (role === 'FACULTY') return <Navigate to="/faculty" replace />;
    if (role === 'STUDENT') return <Navigate to="/dashboard" replace />;
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default ProtectedRoute;
