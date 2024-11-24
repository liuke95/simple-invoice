import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AuthGuard: React.FC = () => {
  const token = localStorage.getItem('access_token');

  if (!token) {
    // Redirect to login if not authenticated
    return <Navigate to='/login' replace />;
  }

  return <Outlet />;
};

export default AuthGuard;
