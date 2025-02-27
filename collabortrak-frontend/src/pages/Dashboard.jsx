// src/pages/Dashboard.jsx
import React from "react";
import LogoutButton from "../components/logoutButton/LogoutButton";
const Dashboard = () => {
  return (
    <div>
      <h1>Welcome to the Dashboard!</h1>
      <p>Confirming protected route.</p>
      <LogoutButton />
    </div>
  );
};

export default Dashboard;
