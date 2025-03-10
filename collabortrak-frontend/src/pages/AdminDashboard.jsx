import React from "react";
import AdminDashboardContent from "../components/adminDashboardContent/AdminDashboardContent";
import DashboardLayout from "../components/dashboardLayout/DashboardLayout";

const AdminDashboard = () => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  return (
    <DashboardLayout>
      <AdminDashboardContent isAuthenticated={isAuthenticated} />
    </DashboardLayout>
  );
};

export default AdminDashboard;
