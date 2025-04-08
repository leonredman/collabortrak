import "chart.js/auto";
import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";

const backendUrl = import.meta.env.VITE_BACKEND_URL; // import env vars

const WSDashboardChart = () => {
  const [ticketCounts, setTicketCounts] = useState({
    open: 0,
    ready: 0,
    qaComplete: 0,
  });

  useEffect(() => {
    fetch(`${backendUrl}/api/tickets`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const openCount = data.filter((t) => t.status === "OPEN").length;
        const readyCount = data.filter((t) => t.status === "READY").length;
        const qaCompleteCount = data.filter(
          (t) => t.status === "QA_COMPLETE"
        ).length;

        setTicketCounts({
          open: openCount,
          ready: readyCount,
          qaComplete: qaCompleteCount,
        });
      })
      .catch((error) => {
        console.error("Error fetching ticket data:", error);
      });
  }, []);

  const chartData = {
    labels: ["Open Tickets", "Tickets in Ready", "QA Complete"],
    datasets: [
      {
        label: "WS Ticket Breakdown",
        data: [ticketCounts.open, ticketCounts.ready, ticketCounts.qaComplete],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)", // Red
          "rgba(255, 206, 86, 0.6)", // Yellow
          "rgba(75, 192, 192, 0.6)", // Teal
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="ui segment chart-container">
      <h4 className="ui header">Ticket Overview</h4>
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

export default WSDashboardChart;
