// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    // Redirect unauthenticated users to login page
    return <Navigate to="/login" />;
  }

  return children; // Render children if user is authenticated
};

export default PrivateRoute;
