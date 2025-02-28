// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const userRole = localStorage.getItem("userRole");

  // Check if the user is logged in
  if (!isAuthenticated) {
    console.warn("User not authenticated. Redirecting to login.");
    return <Navigate to="/login" replace />;
  }

  // Check if the user has permission to access the page
  if (!allowedRoles.includes(userRole)) {
    console.warn(
      "User role not authorized for this page. Redirecting to Not Authorized page."
    );
    return <Navigate to="/not-authorized" replace />;
  }

  // Render the page if all checks pass
  return children;
};

export default ProtectedRoute;
