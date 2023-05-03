import React from 'react';

import {
    Navigate,
    Outlet,
  } from 'react-router-dom';
  
  const ProtectedRoute = ({ portfolio, redirectPath = '/login' }) => {
    const { isUserLoggedIn, error } = useAuthToken(portfolio.primaryUiTokenSourceUid);

    if (!isUserLoggedIn) {
        console.warn("Auth error: ", error);
        return <Navigate to={redirectPath} replace />;
    }
  
    return <Outlet />;
  };

export default ProtectedRoute;
