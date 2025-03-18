import React from "react";
import TicketChart from "../widgets/TicketChart";
import TicketsList from "../widgets/TicketsList";

import "./DevDashboardContent.css";

const DevDashboardContent = () => {
  //const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  return (
    <div className="dev-dashboard">
      <h1>Developer Dashboard</h1>

      <div className="widget-container">
        <TicketsList title="Ready" status="READY" />
        <TicketsList title="Build In Progress" status="BUILD_IN_PROGRESS" />
        <TicketsList title="Need Edits" status="NEEDS_EDITS" />
        <TicketsList title="Bugs" category="BUG" />
      </div>

      <div className="chart-container">
        <TicketChart />
      </div>
    </div>
  );
};

export default DevDashboardContent;
