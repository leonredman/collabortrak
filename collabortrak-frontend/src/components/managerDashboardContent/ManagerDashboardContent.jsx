import React, { useEffect, useState } from "react";
import ActivityStream from "../widgets/ActivityStream";
import EmployeeTicketsList from "../widgets/EmployeeTicketsList";
import StatCard from "../widgets/StatCard";
import TicketsDueList from "../widgets/TicketsDueList";
import "./ManagerDashboardContent.css";
import ManagerTicketChart from "./ManagerTicketChart";

const ManagerDashboardContent = () => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    setUserName(localStorage.getItem("userName") || "Manager");
  }, []);

  return (
    <div className="ui container dashboard-container">
      <h2 className="dashboard-header">
        Welcome {userName} To Your Manager Dashboard
      </h2>

      {/* First Row */}
      <div className="ui segment">
        <h3>Ticket Stats</h3>
        <StatCard />
      </div>

      {/* Second Row */}
      <div className="ui two column grid" style={{ marginTop: "1rem" }}>
        <div className="column">
          <div className="ui orange segment">
            <h3>Ticket Status Overview</h3>
            <ManagerTicketChart />
          </div>
        </div>
        <div className="column">
          <div className="ui purple segment">
            <EmployeeTicketsList />
          </div>
        </div>
      </div>

      {/* Third Row */}
      <div className="ui two column grid" style={{ marginTop: "1rem" }}>
        <div className="column">
          <div className="ui red segment">
            <ActivityStream />
          </div>
        </div>
        <div className="column">
          <div className="ui blue segment">
            <TicketsDueList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboardContent;
