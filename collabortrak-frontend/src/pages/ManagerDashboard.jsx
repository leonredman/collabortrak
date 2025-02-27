// Manager Dashboard.jsx
import React from "react";
import LogoutButton from "../components/logoutButton/LogoutButton";

const ManagerDashboard = () => {
  return (
    <div>
      <h1>Welcome to the Manager Dashboard!</h1>
      <p>Confirming protected route.</p>
      <LogoutButton />
    </div>
  );
};

export default ManagerDashboard;
