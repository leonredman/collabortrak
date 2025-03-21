import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ActiveBugsList = () => {
  const [bugs, setBugs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const bugsPerPage = 3; // Limit tickets per page

  useEffect(() => {
    fetch("http://localhost:8080/api/tickets", {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        // ✅ Filter bugs by status (OPEN, READY, QA_NEEDS_EDITS)
        const activeBugs = data.filter(
          (ticket) =>
            ticket.category === "BUG" &&
            (ticket.status === "OPEN" ||
              ticket.status === "READY" ||
              ticket.status === "QA_NEEDS_EDITS")
        );
        setBugs(activeBugs);
      })
      .catch((error) => console.error("Error fetching active bugs:", error));
  }, []);

  // Pagination Logic
  const indexOfLastBug = currentPage * bugsPerPage;
  const indexOfFirstBug = indexOfLastBug - bugsPerPage;
  const currentBugs = bugs.slice(indexOfFirstBug, indexOfLastBug);
  const totalPages = Math.ceil(bugs.length / bugsPerPage);

  return (
    <div className="ui segment">
      <table className="ui celled table">
        <thead>
          <tr>
            <th>Tracking #</th>
            <th>Title</th>
            <th>Status</th>
            <th>Last Updated</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {currentBugs.length > 0 ? (
            currentBugs.map((bug) => (
              <tr key={bug.id}>
                <td>{bug.ticketTrackingNumber}</td>
                <td>{bug.title}</td>
                <td>{bug.status.replace(/_/g, " ")}</td>
                <td>
                  {bug.lastUpdate
                    ? new Date(bug.lastUpdate).toLocaleDateString()
                    : "No Updates"}
                </td>
                <td>
                  <Link to={`/edit-ticket/${bug.id}`}>
                    <i className="edit icon"></i>
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No active bugs found</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="ui pagination menu">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              className={`item ${currentPage === index + 1 ? "active" : ""}`}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActiveBugsList;
