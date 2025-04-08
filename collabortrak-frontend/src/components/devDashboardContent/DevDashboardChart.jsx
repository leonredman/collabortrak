import "chart.js/auto";
import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";

const backendUrl = import.meta.env.VITE_BACKEND_URL; // import env vars

const DevDashboardChart = () => {
  const [ticketCounts, setTicketCounts] = useState({
    READY: 0,
    BUILD_IN_PROGRESS: 0,
    QA_NEEDS_EDITS: 0,
    ACTIVE_BUGS: 0,
  });

  useEffect(() => {
    fetch(`${backendUrl}/api/tickets`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        const statusCounts = {
          READY: 0,
          BUILD_IN_PROGRESS: 0,
          QA_NEEDS_EDITS: 0,
          ACTIVE_BUGS: 0,
        };

        data.forEach((ticket) => {
          if (ticket.status === "READY") {
            statusCounts.READY += 1;
          } else if (ticket.status === "BUILD_IN_PROGRESS") {
            statusCounts.BUILD_IN_PROGRESS += 1;
          } else if (ticket.status === "QA_NEEDS_EDITS") {
            statusCounts.QA_NEEDS_EDITS += 1;
          }

          // Count Active Bugs (category BUG + status OPEN, READY, QA_NEEDS_EDITS)
          if (
            ticket.category === "BUG" &&
            ["OPEN", "READY", "QA_NEEDS_EDITS"].includes(ticket.status)
          ) {
            statusCounts.ACTIVE_BUGS += 1;
          }
        });

        setTicketCounts(statusCounts);
      })
      .catch((error) => console.error("Error fetching tickets:", error));
  }, []);

  const chartData = {
    labels: ["Ready", "Build In Progress", "Needs Edits", "Active Bugs"],
    datasets: [
      {
        label: "Tickets by Status",
        data: [
          ticketCounts.READY,
          ticketCounts.BUILD_IN_PROGRESS,
          ticketCounts.QA_NEEDS_EDITS,
          ticketCounts.ACTIVE_BUGS,
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)", // Red - Ready
          "rgba(54, 162, 235, 0.6)", // Blue - Build In Progress
          "rgba(255, 206, 86, 0.6)", // Yellow - Needs Edits
          "rgba(153, 102, 255, 0.6)", // Purple - Active Bugs
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="ui segment chart-container">
      <div style={{ width: "300px", height: "300px", margin: "auto" }}>
        <Doughnut
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "bottom",
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default DevDashboardChart;
