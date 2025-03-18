// Dev Dashboard.jsx
import React from "react";
import DashboardLayout from "../components/dashboardLayout/DashboardLayout";
import DevDashboardContent from "../components/devDashboardContent/DevDashboardContent";

const DeveloperDashboard = () => {
  return (
    <DashboardLayout>
      <DevDashboardContent />
    </DashboardLayout>
  );
};

export default DeveloperDashboard;
