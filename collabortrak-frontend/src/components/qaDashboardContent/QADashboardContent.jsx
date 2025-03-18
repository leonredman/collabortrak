import React from "react";
import TicketChart from "../widgets/TicketChart";
import TicketsList from "../widgets/TicketsList";
import "./QADashboardContent.css";

const QADashboardContent = () => {
  return (
    <div className="qa-dashboard">
      <h1>QA Dashboard</h1>

      <div className="widget-container">
        <TicketsList title="Tickets in Ready for QA" status="READY_FOR_QA" />
        <TicketsList
          title="Tickets in QA In Progress"
          status="QA_IN_PROGRESS"
        />
        <TicketsList title="Tickets that Need Edits" status="QA_NEEDS_EDITS" />
        <TicketsList title="Bugs (All Statuses)" category="BUG" />
      </div>

      <div className="chart-container">
        <TicketChart />
      </div>
    </div>
  );
};

export default QADashboardContent;
