import React, { useEffect, useState } from "react";

const backendUrl = import.meta.env.VITE_BACKEND_URL; // import env vars

const StatCard = () => {
  const [stats, setStats] = useState({
    totalReady: 0,
    totalInProgress: 0,
    totalPublished: 0,
  });

  useEffect(() => {
    fetch(`${backendUrl}/api/tickets`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Tickets Data for Stats:", data);

        // Count tickets based on status
        const readyCount = data.filter(
          (ticket) => ticket.status === "READY"
        ).length;
        const inProgressCount = data.filter(
          (ticket) =>
            ticket.status === "BUILD_IN_PROGRESS" ||
            ticket.status === "QA_IN_PROGRESS"
        ).length;
        const publishedCount = data.filter(
          (ticket) => ticket.status === "PUBLISHED"
        ).length;

        setStats({
          totalReady: readyCount,
          totalInProgress: inProgressCount,
          totalPublished: publishedCount,
        });
      })
      .catch((error) => console.error("Error fetching ticket stats:", error));
  }, []);

  return (
    <div className="ui three column grid">
      {/* Total Ready */}
      <div className="column">
        <div className="ui green segment">
          <h3>Total Ready</h3>
          <p className="stats-value">{stats.totalReady}</p>
        </div>
      </div>

      {/* Total In Progress */}
      <div className="column">
        <div className="ui blue segment">
          <h3>Total In Progress</h3>
          <p className="stats-value">{stats.totalInProgress}</p>
        </div>
      </div>

      {/* Total Published */}
      <div className="column">
        <div className="ui yellow segment">
          <h3>Total Published</h3>
          <p className="stats-value">{stats.totalPublished}</p>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
