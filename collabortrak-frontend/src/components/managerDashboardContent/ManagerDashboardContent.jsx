import React from "react";
import ActivityStream from "../widgets/ActivityStream";
import EmployeeTicketsList from "../widgets/EmployeeTicketsList";
import StatCard from "../widgets/StatCard";
import TicketChart from "../widgets/TicketChart";
import TicketsDueList from "../widgets/TicketsDueList";
import "./ManagerDashboardContent.css";

const ManagerDashboardContent = () => {
  return (
    <div className="manager-dashboard">
      <h1>Manager Dashboard</h1>

      {/* Row 1: Chart + Stats */}
      <div className="dashboard-row">
        <div className="chart-section">
          <TicketChart />
        </div>
        <div className="stats-section">
          <StatCard title="Total Ready" count={25} />
          <StatCard title="Total In Progress" count={12} />
          <StatCard title="Total Published" count={8} />
        </div>
      </div>

      {/* Row 2: Activity Stream + Active Tickets */}
      <div className="dashboard-row">
        <div className="left-section">
          <ActivityStream />
          <TicketsDueList />
        </div>
        <div className="right-section">
          <EmployeeTicketsList />
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboardContent;
