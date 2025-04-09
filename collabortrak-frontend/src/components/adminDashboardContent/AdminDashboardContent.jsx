import React, { useEffect, useState } from "react";
import TicketStatusChart from "../charts/TicketStatusChart";
import "./AdminDashboardContent.css";
import NewTicketsList from "./NewTicketsList";
import TicketsInProgressList from "./TicketsInProgressList";
import TicketsInQAList from "./TicketsInQAList";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const AdminDashboardContent = ({ isAuthenticated }) => {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    console.log(
      "AdminDashboardContent Rendered! isAuthenticated:",
      isAuthenticated
    );
    setUserName(localStorage.getItem("userName") || "Admin");

    if (!isAuthenticated) {
      console.log("User not authenticated, skipping fetch...");
      return;
    }

    const fetchTickets = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/tickets`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        console.log("Fetch Response Received:", response);

        if (!response.ok) {
          throw new Error(
            `HTTP Error ${response.status}: ${response.statusText}`
          );
        }

        const data = await response.json();
        console.log("Tickets fetched successfully:", data);
        setTickets(data);
      } catch (err) {
        console.error("Error fetching tickets:", err.message);
        setError(err.message);
      }
    };

    fetchTickets();
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

      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {/* Row 1: Ticket Status Count */}
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

      {/* Row 2: Lists for Open and Build In Progress */}
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

      {/* Row 3: Chart + QA Tickets */}
      <div className="ui two column grid dashboard-lists">
        <div className="column">
          <div className="ui purple segment dashboard-chart">
            <h3>Ticket Status Overview</h3>
            <TicketStatusChart apiUrl={`${backendUrl}/api/tickets`} />
          </div>
        </div>
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
