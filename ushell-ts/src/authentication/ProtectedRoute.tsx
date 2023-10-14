import React from "react";
import { Navigate, Outlet } from "react-router-dom";

import { useAuthToken } from "./useAuthToken";

interface IProtectedRouteProps {
  primaryUiTokenSourceUid: string
  redirectPath: string
}

const ProtectedRoute: React.FC<IProtectedRouteProps> = ({ primaryUiTokenSourceUid, redirectPath }) => {
  const isAuthenticated: boolean = useAuthToken(primaryUiTokenSourceUid);

  if (!isAuthenticated) {
    console.error("Protected route -> Auth error!");
    return <Navigate to={redirectPath} replace />
  }

  return <Outlet/>
};

export default ProtectedRoute;