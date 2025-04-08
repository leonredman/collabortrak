import React, { useEffect, useState } from "react";
import TicketsInProgressList from "../adminDashboardContent/TicketsInProgressList"; // Reusing Admin Widget
import ActiveBugsList from "../widgets/ActiveBugsList";
import QaNeedsEditsList from "../widgets/QaNeedsEditsList"; // Newly Added Widget
import TicketsInReadyList from "../widgets/TicketsInReadyList";
import DevDashboardChart from "./DevDashboardChart";
import "./DevDashboardContent.css";

const backendUrl = import.meta.env.VITE_BACKEND_URL; // import env vars

const DevDashboardContent = () => {
  const [userName, setUserName] = useState("");
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    setUserName(localStorage.getItem("userName") || "Developer");

    fetch(`${backendUrl}/api//tickets`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        setTickets(data);
      })
      .catch((error) => console.error("Error fetching tickets:", error));
  }, []);

  const countByStatus = (status) =>
    tickets.filter((ticket) => ticket.status === status).length;

  return (
    <div className="ui container dashboard-container">
      <h2 className="dashboard-header">
        Welcome {userName} To Your Developer Dashboard
      </h2>

      {/* First Row: Ticket Status Totals */}
      <div className="ui four column grid dashboard-stats">
        <div className="column">
          <div className="ui red segment">
            <h3>Total Ready</h3>
            <p className="dashboard-value">{countByStatus("READY")}</p>
          </div>
        </div>
        <div className="column">
          <div className="ui blue segment">
            <h3>Total Build In Progress</h3>
            <p className="dashboard-value">
              {countByStatus("BUILD_IN_PROGRESS")}
            </p>
          </div>
        </div>
        <div className="column">
          <div className="ui yellow segment">
            <h3>Total Need Edits</h3>
            <p className="dashboard-value">{countByStatus("QA_NEEDS_EDITS")}</p>
          </div>
        </div>
        <div className="column">
          <div className="ui purple segment">
            <h3>Total Active Bugs</h3>
            <p className="dashboard-value">
              {
                tickets.filter(
                  (ticket) =>
                    ticket.category === "BUG" &&
                    ["OPEN", "READY", "QA_NEEDS_EDITS"].includes(ticket.status)
                ).length
              }
            </p>
          </div>
        </div>
      </div>

      {/* Second Row: Tickets in Ready + Build In Progress */}
      <div className="ui two column grid dashboard-lists">
        <div className="column">
          <div className="ui red segment">
            <h3>Tickets in Ready</h3>
            <TicketsInReadyList />
          </div>
        </div>
        <div className="column">
          <div className="ui blue segment">
            <h3>Tickets in Build In Progress</h3>
            <TicketsInProgressList /> {/* Reused Widget from Admin Dashboard */}
          </div>
        </div>
      </div>

      {/* Third Row */}
      <div className="ui two column grid dashboard-lists">
        <div className="column">
          <div className="ui yellow segment">
            <h3>Tickets that Need Edits</h3>
            <QaNeedsEditsList />
          </div>
        </div>
        <div className="column">
          <div className="ui purple segment">
            <h3>Active Bugs</h3>
            <ActiveBugsList />
          </div>
        </div>
      </div>

      {/* Fourth Row: Developer Ticket Chart */}
      <div className="ui segment dashboard-chart">
        <h3>Developer Ticket Status Overview</h3>
        <DevDashboardChart />
      </div>
    </div>
  );
};

export default DevDashboardContent;
