import React, { useEffect, useState } from "react";
import NewTicketsList from "../widgets/NewTicketsList";
import QATicketsCompleteList from "../widgets/QATicketsCompleteList";
import TicketsInReadyList from "../widgets/TicketsInReadyList";
import WSDashboardChart from "./WSDashboardChart";

import "./WSDashboardContent.css";

const backendUrl = import.meta.env.VITE_BACKEND_URL; // import env vars

const WSDashboardContent = () => {
  const [userName, setUserName] = useState("");
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    setUserName(localStorage.getItem("userName") || "Website Specialist");

    fetch(`${backendUrl}/api/tickets`, {
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
    <div className="ws-dashboard">
      <h2 className="dashboard-header">
        Welcome {userName} To Your Website Specialist Dashboard
      </h2>

      {/* First Row: Ticket Status Totals (3 Columns) */}
      <div className="ui three column grid dashboard-stats">
        <div className="column">
          <div className="ui red segment">
            <h3>Tickets In Open</h3>
            <p className="dashboard-value">{countByStatus("OPEN")}</p>
          </div>
        </div>
        <div className="column">
          <div className="ui blue segment">
            <h3>Tickets In Ready</h3>
            <p className="dashboard-value">{countByStatus("READY")}</p>
          </div>
        </div>
        <div className="column">
          <div className="ui yellow segment">
            <h3>Tickets In QA Complete</h3>
            <p className="dashboard-value">{countByStatus("QA_COMPLETE")}</p>
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div className="ui two column grid dashboard-lists">
        <div className="column">
          <div className="ui red segment">
            <h3>Tickets in Open</h3>
            <NewTicketsList />
          </div>
        </div>
        <div className="column">
          <div className="ui blue segment">
            <h3>Tickets in Ready</h3>
            <TicketsInReadyList />
          </div>
        </div>
      </div>
      {/* Third Row */}
      <div className="ui two column grid dashboard-lists">
        {/* Left Column: Chart */}
        <div className="column">
          <div className="ui purple segment dashboard-chart">
            <h3>QA Ticket Status Overview</h3>
            <WSDashboardChart />
          </div>
        </div>

        <div className="column">
          <div className="ui yellow segment">
            <h3>Tickets QA Edits Complete</h3>
            <QATicketsCompleteList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WSDashboardContent;
