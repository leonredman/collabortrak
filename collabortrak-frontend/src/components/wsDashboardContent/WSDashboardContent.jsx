import React from "react";
import TicketChart from "../widgets/TicketChart";
import TicketsList from "../widgets/TicketsList";
import "./WSDashboardContent.css";

const WSDashboardContent = () => {
  return (
    <div className="ws-dashboard">
      <h1>Website Specialist Dashboard</h1>

      <div className="widget-container">
        <TicketsList title="Open" status="OPEN" />
        <TicketsList title="Ready" status="READY" />
        <TicketsList title="QA Complete" status="QA_COMPLETE" />
        <TicketsList title="Bugs (All Statuses)" category="BUG" />
      </div>

      <div className="chart-container">
        <TicketChart />
      </div>
    </div>
  );
};

export default WSDashboardContent;
