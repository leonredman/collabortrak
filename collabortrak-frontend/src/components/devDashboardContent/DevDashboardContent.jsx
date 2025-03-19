import React, { useEffect, useState } from "react";
import TicketChart from "../widgets/TicketChart";
import TicketsList from "../widgets/TicketsList";

import "./DevDashboardContent.css";

const DevDashboardContent = () => {
  const [userName, setUserName] = useState("");

  //const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  useEffect(() => {
    setUserName(localStorage.getItem("userName") || "Developer");
  }, []);

  return (
    <div className="dev-dashboard">
      <h1>Welcome, {userName}</h1>

      <div className="widget-container">
        <TicketsList title="Ready" status="READY" />
        <TicketsList
          title="Build In Progress"
          status="BUILD_IN_PROGRESS"
          assignedTo="self"
        />
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
