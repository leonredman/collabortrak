// src/pages/NotAuthorized.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const NotAuthorized = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  return (
    <div style={{ padding: "50px", textAlign: "center" }}>
      <h1>403 - Not Authorized</h1>
      <p>You do not have permission to access this page.</p>
      <Link to="/login" onClick={handleLogout}>
        Click here to login in with a different account
      </Link>
    </div>
  );
};

export default NotAuthorized;
