import "chart.js/auto";
import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";

const ManagerTicketChart = ({
  apiUrl = "http://localhost:8080/api/tickets",
}) => {
  const [ticketCounts, setTicketCounts] = useState({
    READY: 0,
    BUILD_IN_PROGRESS: 0,
    PUBLISHED: 0,
  });

  useEffect(() => {
    console.log("Fetching chart data for Manager Dashboard from:", apiUrl);

    fetch(apiUrl, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`API Error: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Manager Chart API Response:", data);

        // ✅ Filter tickets to match Manager Dashboard needs
        const statusCounts = {
          READY: 0,
          BUILD_IN_PROGRESS: 0,
          PUBLISHED: 0,
        };

        data.forEach((ticket) => {
          if (statusCounts[ticket.status] !== undefined) {
            statusCounts[ticket.status] += 1;
          }
        });

        setTicketCounts(statusCounts);
      })
      .catch((error) => console.error("Error fetching chart data:", error));
  }, [apiUrl]);

  const chartData = {
    labels: ["Ready", "Build In Progress", "Published"],
    datasets: [
      {
        label: "Tickets by Status",
        data: Object.values(ticketCounts),
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)", // Ready - Green
          "rgba(54, 162, 235, 0.6)", // Build In Progress - Blue
          "rgba(255, 206, 86, 0.6)", // Published - Yellow
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="ui segment chart-container">
      <h3>Manager Ticket Status Overview</h3>
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

export default ManagerTicketChart;
