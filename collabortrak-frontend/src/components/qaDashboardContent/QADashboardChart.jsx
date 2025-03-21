import "chart.js/auto";
import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";

const QADashboardChart = () => {
  const [qaCounts, setQaCounts] = useState({
    READY_FOR_QA: 0,
    QA_IN_PROGRESS: 0,
    QA_NEEDS_EDITS: 0,
    QA_EDITS_COMPLETE: 0,
  });

  useEffect(() => {
    fetch("http://localhost:8080/api/tickets", {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        const counts = {
          READY_FOR_QA: 0,
          QA_IN_PROGRESS: 0,
          QA_NEEDS_EDITS: 0,
          QA_EDITS_COMPLETE: 0,
        };

        data.forEach((ticket) => {
          if (counts[ticket.status] !== undefined) {
            counts[ticket.status]++;
          }
        });

        setQaCounts(counts);
      })
      .catch((error) =>
        console.error("Error fetching tickets for QA Chart:", error)
      );
  }, []);

  const chartData = {
    labels: ["Ready for QA", "QA In Progress", "Needs Edits", "Edits Complete"],
    datasets: [
      {
        label: "QA Ticket Statuses",
        data: Object.values(qaCounts),
        backgroundColor: [
          "rgba(54, 162, 235, 0.6)", // Blue
          "rgba(255, 206, 86, 0.6)", // Yellow
          "rgba(255, 99, 132, 0.6)", // Red
          "rgba(153, 102, 255, 0.6)", // Purple
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="ui segment">
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

export default QADashboardChart;
