// src/manager/routes/ProtectedRoute.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import AuthService from '../services/authService';

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();

  if (!AuthService.isAuthenticated()) {
    return <Navigate to="/manager/login" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
