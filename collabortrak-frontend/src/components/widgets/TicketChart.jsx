import "chart.js/auto";
import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";

const TicketChart = ({ apiUrl }) => {
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

  return (
    <div className="ui segment chart-container">
      <div style={{ width: "300px", height: "300px", margin: "auto" }}>
        <Doughnut
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            aspectRatio: 2,
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

export default TicketChart;
