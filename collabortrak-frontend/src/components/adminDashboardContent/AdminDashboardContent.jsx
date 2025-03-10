import React, { useEffect, useState } from "react";

import TicketStatusChart from "../charts/TicketStatusChart";
import NewTicketsList from "./NewTicketsList";
import TicketsInProgressList from "./TicketsInProgressList";
import TicketsInQAList from "./TicketsInQAList";

import "./AdminDashboardContent.css"; // ✅ Import custom styles

const AdminDashboardContent = ({ isAuthenticated }) => {
  const [tickets, setTickets] = useState([]);
  console.log(
    "AdminDashboardContent Rendered! isAuthenticated:",
    isAuthenticated
  );

  useEffect(() => {
    console.log(
      "useEffect triggered in AdminDashboard! Checking `isAuthenticated`..."
    );
    if (!isAuthenticated) {
      console.log("User not authenticated, skipping fetch...");
      return;
    }

    console.log("Fetching ticketData from API!");

    fetch("http://localhost:8080/api/tickets", {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        console.log("📥 Fetch Response Received:", res);
        return res.json();
      })
      .then((data) => {
        console.log("Tickets fetched successfully:", data);
        setTickets(data);
      })
      .catch((error) => console.error("Error fetching tickets:", error));
  }, [isAuthenticated]);

  const countByStatus = (status) =>
    tickets.filter((ticket) => ticket.status === status).length;

  return (
    <div className="ui container dashboard-container">
      <h2 className="dashboard-header">Admin Dashboard</h2>
      <p className="dashboard-subtext">
        Welcome! Here you can manage all ticketing and project workflows.
      </p>

      {/* 🟢 First Row: Ticket Status Totals (4 Columns) */}
      <div className="ui four column grid dashboard-stats">
        <div className="column">
          <div className="ui red segment">
            <h4>Ready</h4>
            <p className="dashboard-value">{countByStatus("READY")}</p>
          </div>
        </div>
        <div className="column">
          <div className="ui blue segment">
            <h4>Build In Progress</h4>
            <p className="dashboard-value">
              {countByStatus("BUILD_IN_PROGRESS")}
            </p>
          </div>
        </div>
        <div className="column">
          <div className="ui orange segment">
            <h4>QA In Progress</h4>
            <p className="dashboard-value">{countByStatus("QA_IN_PROGRESS")}</p>
          </div>
        </div>
        <div className="column">
          <div className="ui green segment">
            <h4>Resolved</h4>
            <p className="dashboard-value">{countByStatus("RESOLVED")}</p>
          </div>
        </div>
      </div>

      {/* 🔵 Second Row: New Tickets & Tickets In Progress (2 Columns) */}
      <div className="ui two column grid dashboard-lists">
        <div className="column">
          <div className="ui red segment">
            <h4>New Tickets</h4>
            <NewTicketsList />
          </div>
        </div>
        <div className="column">
          <div className="ui blue segment">
            <h4>Tickets In Progress</h4>
            <TicketsInProgressList />
          </div>
        </div>
      </div>

      {/* 🟠 Third Row: Ticket Status Chart (Left) & Tickets In QA (Right) */}
      <div className="ui two column grid dashboard-lists">
        {/* 📊 Left Column: Chart */}
        <div className="column">
          <div className="ui segment dashboard-chart">
            <h3>Ticket Status Overview</h3>
            <TicketStatusChart apiUrl="http://localhost:8080/api/tickets" />
          </div>
        </div>

        {/* 🟠 Right Column: Tickets In QA */}
        <div className="column">
          <div className="ui orange segment">
            <h4>Tickets In QA</h4>
            <TicketsInQAList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardContent;
