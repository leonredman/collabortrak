import React, { useEffect, useState } from "react";
import QADashboardChart from "../qaDashboardContent/QADashboardChart";
import QATicketsEditsCompleteList from "../widgets/QATicketsEditsCompleteList";
import QATicketsInProgressList from "../widgets/QATicketsInProgressList";
import TicketsReadyForQAList from "../widgets/TicketsReadyForQAList";

import "./QADashboardContent.css";

const backendUrl = import.meta.env.VITE_BACKEND_URL; // import env vars

const QADashboardContent = () => {
  const [userName, setUserName] = useState("");
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    setUserName(localStorage.getItem("userName") || "QA Agent");

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
    <div className="qa-dashboard">
      <h2 className="dashboard-header">
        Welcome {userName} To Your QA Dashboard
      </h2>

      {/* First Row */}
      <div className="ui four column grid dashboard-stats">
        <div className="column">
          <div className="ui red segment">
            <h3>Ready For QA</h3>
            <p className="dashboard-value">{countByStatus("READY_FOR_QA")}</p>
          </div>
        </div>
        <div className="column">
          <div className="ui blue segment">
            <h3>QA In Progress</h3>
            <p className="dashboard-value">{countByStatus("QA_IN_PROGRESS")}</p>
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
                    [
                      "QA_EDITS_COMPLETE",
                      "QA_IN_PROGRESS",
                      "READY_FOR_QA",
                      "QA_NEEDS_EDITS",
                    ].includes(ticket.status)
                ).length
              }
            </p>
          </div>
        </div>
      </div>
      {/* Second Row */}
      <div className="ui two column grid dashboard-lists">
        <div className="column">
          {/* Custom Widget for Ready for QA */}
          <div className="ui red segment">
            <h3>Tickets Ready for QA</h3>
            <TicketsReadyForQAList />
          </div>
        </div>
        <div className="column">
          <div className="ui orange segment">
            <h3>Tickets QA In Progress</h3>
            <QATicketsInProgressList />
          </div>
        </div>
      </div>
      {/* Third Row */}
      <div className="ui two column grid dashboard-lists">
        {/* Left Column: Chart */}
        <div className="column">
          <div className="ui purple segment dashboard-chart">
            <h3>QA Ticket Status Overview</h3>
            <QADashboardChart />
          </div>
        </div>

        <div className="column">
          <div className="ui yellow segment">
            <h3>Tickets QA Edits Complete</h3>
            <QATicketsEditsCompleteList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QADashboardContent;
