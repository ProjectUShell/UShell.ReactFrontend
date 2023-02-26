import React from 'react';

import {
    Navigate,
    Outlet,
  } from 'react-router-dom';
  
  const ProtectedRoute = ({ auth, redirectPath = '/login' }) => {
    if (!auth) {
      return <Navigate to={redirectPath} replace />;
    }
  
    return <Outlet />;
  };

export default ProtectedRoute;