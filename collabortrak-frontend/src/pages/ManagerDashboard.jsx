// Manager Dashboard.jsx
import React from "react";
import DashboardLayout from "../components/dashboardLayout/DashboardLayout";

// import LogoutButton from "../components/logoutButton/LogoutButton";

const ManagerDashboard = () => {
  return (
    <DashboardLayout>
      <div>
        <h1>Welcome to the Manager Dashboard!</h1>
        <p>Confirming protected route.</p>
      </div>
    </DashboardLayout>
  );
};

export default ManagerDashboard;
