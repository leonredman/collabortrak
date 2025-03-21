import React, { useEffect, useState } from "react";
import TicketChart from "../widgets/TicketChart";
import TicketsList from "../widgets/TicketsList";
import "./WSDashboardContent.css";

const WSDashboardContent = () => {
  const [userName, setUserName] = useState("");
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    setUserName(localStorage.getItem("userName") || "Developer");

    fetch("http://localhost:8080/api/tickets", {
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
