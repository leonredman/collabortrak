// Manager Dashboard.jsx
import React from "react";
import DashboardLayout from "../components/dashboardLayout/DashboardLayout";
import ManagerDashboardContent from "../components/managerDashboardContent/ManagerDashboardContent";

// import LogoutButton from "../components/logoutButton/LogoutButton";

const ManagerDashboard = () => {
  return (
    <DashboardLayout>
      <ManagerDashboardContent />
    </DashboardLayout>
  );
};

export default ManagerDashboard;
