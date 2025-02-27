// Dev Dashboard.jsx
import React from "react";
import LogoutButton from "../components/logoutButton/LogoutButton";

const DeveloperDashboard = () => {
  return (
    <div>
      <h1>Welcome to the Developer Dashboard!</h1>
      <p>Confirming protected route.</p>
      <LogoutButton />
    </div>
  );
};

export default DeveloperDashboard;
