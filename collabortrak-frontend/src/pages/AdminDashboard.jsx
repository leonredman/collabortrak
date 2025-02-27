// AdminDashboard.jsx
import React from "react";
import LogoutButton from "../components/logoutButton/LogoutButton";

const AdminDashboard = () => {
  return (
    <div>
      <h1>Welcome to the Admin Dashboard!</h1>
      <p>Confirming protected route.</p>
      <LogoutButton />
    </div>
  );
};

export default AdminDashboard;
