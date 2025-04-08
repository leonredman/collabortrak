import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const TicketsInProgressList = () => {
  const [tickets, setTickets] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 3; // Ensure only 4 tickets per page

  const backendUrl = import.meta.env.VITE_BACKEND_URL; // import env vars

  useEffect(() => {
    fetch(`${backendUrl}/api/tickets`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        // Filter tickets with status "BUILD_IN_PROGRESS"
        const inProgressTickets = data.filter(
          (ticket) => ticket.status === "BUILD_IN_PROGRESS"
        );
        setTickets(inProgressTickets);
      })
      .catch((error) => console.error("Error fetching tickets:", error));
  }, []);

  // Pagination Logic (Only 4 tickets per page)
  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = tickets.slice(indexOfFirstTicket, indexOfLastTicket);
  const totalPages = Math.ceil(tickets.length / ticketsPerPage);

  return (
    <div className="ui segment">
      <table className="ui celled table">
        <thead>
          <tr>
            <th>Tracking #</th>
            <th>Title</th>
            <th>Assigned</th>
            <th>Updated</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {currentTickets.map((ticket) => (
            <tr key={ticket.id}>
              <td>{ticket.ticketTrackingNumber}</td>
              <td>{ticket.title}</td>
              <td>
                {console.log(
                  "Ticket ID:",
                  ticket.id,
                  "Assigned Employee:",
                  ticket.assignedEmployee
                )}
                {console.log(
                  "Ticket ID:",
                  ticket.id,
                  "Assigned Employee:",
                  ticket.assignedEmployee
                )}

                {ticket.assignedEmployeeFirstName
                  ? `${ticket.assignedEmployeeFirstName} ${ticket.assignedEmployeeLastName}`
                  : "Unassigned"}
              </td>

              {console.log(
                "Ticket ID:",
                ticket.id,
                "Assigned Employee:",
                ticket.assignedEmployee
              )}
              <td>
                {ticket.lastUpdate
                  ? new Date(ticket.lastUpdate).toLocaleDateString()
                  : "No Updates"}
              </td>
              <td>
                <Link to={`/edit-ticket/${ticket.id}`}>
                  <i className="edit icon"></i>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls (Only if more than 4 tickets exist) */}
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

export default TicketsInProgressList;
