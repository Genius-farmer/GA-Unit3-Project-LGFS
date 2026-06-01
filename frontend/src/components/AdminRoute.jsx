import React, { useContext } from "react";
import UserContext from "../context/UserContext.js";
import { Navigate } from "react-router";

const AdminRoute = (props) => {
  const userCtx = useContext(UserContext);
  const isAuthenticated = userCtx.accessToken.length > 0;
  const isAdmin = userCtx.role === "admin";

  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (!isAdmin) return <Navigate to="/user/dashboard" replace />;
  return props.children;
};

export default AdminRoute;
