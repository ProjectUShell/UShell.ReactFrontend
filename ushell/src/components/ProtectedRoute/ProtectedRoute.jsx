import React from 'react';

import {
    Navigate,
    Outlet,
  } from 'react-router-dom';

import useAuthToken from '../../hooks/useAuthToken';
  
const ProtectedRoute = ({ portfolio, redirectPath = '/login' }) => {
  const isUserLoggedIn = useAuthToken(portfolio.primaryUiTokenSourceUid);

  if (!isUserLoggedIn) {
      console.warn("Auth error: failed to sign in.");
      return <Navigate to={redirectPath} replace />;
  }
  
  return <Outlet />;
};

export default ProtectedRoute;
