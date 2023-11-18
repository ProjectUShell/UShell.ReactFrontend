import React from "react";
import { Navigate, Outlet } from "react-router-dom";

// import { isAuthenticated } from "./useAuthToken";

interface IProtectedRouteProps {
  primaryUiTokenSourceUid: string
  redirectPath: string
}

const ProtectedRoute: React.FC<IProtectedRouteProps> = ({ primaryUiTokenSourceUid, redirectPath }) => {

  



  // const isAuthenticated: boolean = isAuthenticated(primaryUiTokenSourceUid);
  // if (!isAuthenticated) {
  //   //return <div>NOT ALLOWED</div>
  //   console.error("Protected route -> Auth error!");
  //   return <Navigate to={redirectPath} replace />
  // }

  //return <div>ALLOWED</div>
  return <Outlet/>
};

export default ProtectedRoute;