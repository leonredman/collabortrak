import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL; // import env vars

const ActivityStream = () => {
  const [tickets, setTickets] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 3; // Limit to 3 per page

  useEffect(() => {
    fetch(`${backendUrl}/api/tickets`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        // Sort tickets by last update date (most recent first)
        const sortedTickets = data.sort(
          (a, b) => new Date(b.lastUpdate) - new Date(a.lastUpdate)
        );
        setTickets(sortedTickets);
      })
      .catch((error) => console.error("Error fetching tickets:", error));
  }, []);

  // Pagination Logic
  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = tickets.slice(indexOfFirstTicket, indexOfLastTicket);
  const totalPages = Math.ceil(tickets.length / ticketsPerPage);

  return (
    <div className="ui segment">
      <h3>Activity Stream (Recent Ticket Updates)</h3>
      <table className="ui celled table">
        <thead>
          <tr>
            <th>Tracking #</th>
            <th>Title</th>

            <th>Updated</th>
            <th>Status</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {currentTickets.map((ticket) => (
            <tr key={ticket.id}>
              <td>{ticket.ticketTrackingNumber}</td>
              <td>{ticket.title}</td>

              <td>
                {ticket.lastUpdate
                  ? new Date(ticket.lastUpdate).toLocaleDateString()
                  : "No Updates"}
              </td>
              <td>{ticket.status}</td>
              <td>
                <Link to={`/edit-ticket/${ticket.id}`}>
                  <i className="edit icon"></i>
                </Link>
              </td>
            </tr>
          ))}
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

export default ActivityStream;
