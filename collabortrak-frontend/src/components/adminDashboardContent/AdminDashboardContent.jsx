import React, { useEffect, useState } from "react";

import TicketStatusChart from "../charts/TicketStatusChart";
import NewTicketsList from "./NewTicketsList";
import TicketsInProgressList from "./TicketsInProgressList";
import TicketsInQAList from "./TicketsInQAList";

import "./AdminDashboardContent.css"; // custom styles

const AdminDashboardContent = ({ isAuthenticated }) => {
  const [tickets, setTickets] = useState([]);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    console.log(
      "AdminDashboardContent Rendered! isAuthenticated:",
      isAuthenticated
    );

    // Fetch the logged-in user’s name
    setUserName(localStorage.getItem("userName") || "Admin");

    if (!isAuthenticated) {
      console.log("User not authenticated, skipping fetch...");
      return;
    }

    console.log("Fetching ticketData from API!");
    const backendUrl = import.meta.env.VITE_BACKEND_URL; // import env vars

    //fetch("http://localhost:8080/api/tickets", {
    fetch(`${backendUrl}/api/tickets`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        console.log("Fetch Response Received:", res);
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
      <h2 className="dashboard-header">
        Welcome {userName} To Your Admin Dashboard
      </h2>
      <p className="dashboard-subtext">
        Manage all ticketing and project workflows.
      </p>

      {/* First Row: Ticket Status Totals (4 Columns) */}
      <div className="ui four column grid dashboard-stats">
        <div className="column">
          <div className="ui red segment">
            <h3>Open</h3>
            <p className="dashboard-value">{countByStatus("OPEN")}</p>
          </div>
        </div>
        <div className="column">
          <div className="ui blue segment">
            <h3>Build In Progress</h3>
            <p className="dashboard-value">
              {countByStatus("BUILD_IN_PROGRESS")}
            </p>
          </div>
        </div>
        <div className="column">
          <div className="ui yellow segment">
            <h3>QA In Progress</h3>
            <p className="dashboard-value">{countByStatus("QA_IN_PROGRESS")}</p>
          </div>
        </div>
        <div className="column">
          <div className="ui green segment">
            <h3>Resolved</h3>
            <p className="dashboard-value">{countByStatus("RESOLVED")}</p>
          </div>
        </div>
      </div>

      {/* Second Row: New Tickets & Tickets In Progress (2 Columns) */}
      <div className="ui two column grid dashboard-lists">
        <div className="column">
          <div className="ui red segment">
            <h3>Open Tickets</h3>
            <NewTicketsList />
          </div>
        </div>
        <div className="column">
          <div className="ui blue segment">
            <h3>Build In Progress Tickets</h3>
            <TicketsInProgressList />
          </div>
        </div>
      </div>

      {/* Third Row: Ticket Status Chart (Left) & Tickets In QA (Right) */}
      <div className="ui two column grid dashboard-lists">
        {/* Left Column: Chart */}
        <div className="column">
          <div className="ui purple segment dashboard-chart">
            <h3>Ticket Status Overview</h3>
            <TicketStatusChart apiUrl="http://localhost:8080/api/tickets" />
          </div>
        </div>

        {/* Right Column: Tickets In QA */}
        <div className="column">
          <div className="ui yellow segment">
            <h3>QA In Progress Tickets</h3>
            <TicketsInQAList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardContent;
