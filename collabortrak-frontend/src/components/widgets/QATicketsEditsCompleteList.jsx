import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const QATicketsEditsCompleteList = () => {
  const [tickets, setTickets] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 3;

  useEffect(() => {
    fetch("http://localhost:8080/api/tickets", {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter(
          (ticket) => ticket.status === "QA_EDITS_COMPLETE"
        );
        setTickets(filtered);
      })
      .catch((error) =>
        console.error("Error fetching QA Edits Complete tickets:", error)
      );
  }, []);

  // Pagination logic
  const indexOfLast = currentPage * ticketsPerPage;
  const indexOfFirst = indexOfLast - ticketsPerPage;
  const currentTickets = tickets.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(tickets.length / ticketsPerPage);

  return (
    <>
      <table className="ui celled table">
        <thead>
          <tr>
            <th>Tracking #</th>
            <th>Title</th>
            <th>Last Updated</th>
            <th>Status</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {currentTickets.length > 0 ? (
            currentTickets.map((ticket) => (
              <tr key={ticket.id}>
                <td>{ticket.ticketTrackingNumber}</td>
                <td>{ticket.title}</td>
                <td>
                  {ticket.lastUpdate
                    ? new Date(ticket.lastUpdate).toLocaleDateString()
                    : "N/A"}
                </td>
                <td>{ticket.status}</td>
                <td>
                  <Link to={`/edit-ticket/${ticket.id}`}>
                    <i className="edit icon"></i>
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No tickets found in Edits Complete.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="ui pagination menu">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`item ${currentPage === i + 1 ? "active" : ""}`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </>
  );
};

export default QATicketsEditsCompleteList;
