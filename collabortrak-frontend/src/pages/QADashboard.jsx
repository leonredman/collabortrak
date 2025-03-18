import React from "react";
import DashboardLayout from "../components/dashboardLayout/DashboardLayout.jsx";
import QADashboardContent from "../components/qaDashboardContent/QADashboardContent.jsx";

const QADashboard = () => {
  return (
    <DashboardLayout>
      <QADashboardContent />
    </DashboardLayout>
  );
};

export default QADashboard;
