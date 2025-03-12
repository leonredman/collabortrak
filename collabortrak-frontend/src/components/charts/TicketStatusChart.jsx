import "chart.js/auto";
import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";

const TicketStatusChart = ({ apiUrl }) => {
  const [ticketCounts, setTicketCounts] = useState({
    OPEN: 0,
    BUILD_IN_PROGRESS: 0,
    QA_IN_PROGRESS: 0,
    RESOLVED: 0,
  });

  useEffect(() => {
    fetch(apiUrl, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        const statusCounts = {
          OPEN: 0,
          BUILD_IN_PROGRESS: 0,
          QA_IN_PROGRESS: 0,
          RESOLVED: 0,
        };

        data.forEach((ticket) => {
          if (statusCounts[ticket.status] !== undefined) {
            statusCounts[ticket.status] += 1;
          }
        });

        setTicketCounts(statusCounts);
      })
      .catch((error) => console.error("Error fetching tickets:", error));
  }, [apiUrl]);

  const chartData = {
    labels: ["Open", "Build In Progress", "QA In Progress", "Resolved"],
    datasets: [
      {
        label: "Tickets by Status",
        data: Object.values(ticketCounts),
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)", // Open - Red
          "rgba(54, 162, 235, 0.6)", // Build In Progress - Blue
          "rgba(255, 206, 86, 0.6)", // QA In Progress - Yellow
          "rgba(75, 192, 192, 0.6)", // Resolved - Green
        ],
        borderWidth: 1,
      },
    ],
  };

  // ⬇ Add these options directly in the Doughnut component
  return (
    <div className="ui segment chart-container">
      <div style={{ width: "300px", height: "300px", margin: "auto" }}>
        <Doughnut
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            aspectRatio: 2, // Makes the chart smaller
            plugins: {
              legend: {
                position: "bottom", // Moves legend to bottom for better spacing
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default TicketStatusChart;
