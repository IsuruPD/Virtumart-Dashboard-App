import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, requiredRoles }) => {
  const { currentUser, userRole } = useAuth();

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  if (requiredRoles && !requiredRoles.includes(userRole)) {
    return <div>You do not have access to this page.</div>;
  }

  return children;
};

export default ProtectedRoute;
