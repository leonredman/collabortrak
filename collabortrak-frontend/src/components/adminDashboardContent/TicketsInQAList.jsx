import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const TicketsInQAList = () => {
  const [tickets, setTickets] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 4; // Show only 4 tickets per page

  useEffect(() => {
    fetch("http://localhost:8080/api/tickets", {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        // Filter tickets with status "QA_IN_PROGRESS"
        const qaTickets = data.filter(
          (ticket) => ticket.status === "QA_IN_PROGRESS"
        );
        setTickets(qaTickets);
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
      <table className="ui celled table">
        <thead>
          <tr>
            <th>Ticket ID</th>
            <th>Title</th>
            <th>Assigned</th>
            <th>Last Update</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {currentTickets.map((ticket) => (
            <tr key={ticket.id}>
              <td>{ticket.id}</td>
              <td>{ticket.title}</td>
              <td>
                {ticket.assignedEmployeeFirstName
                  ? `${ticket.assignedEmployeeFirstName} ${ticket.assignedEmployeeLastName}`
                  : "Unassigned"}
              </td>
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

export default TicketsInQAList;
