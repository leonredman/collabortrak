import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const NewTicketsList = () => {
  const [tickets, setTickets] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 3; // Show max 4 tickets per page

  useEffect(() => {
    fetch("http://localhost:8080/api/tickets", {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        // Filter tickets with status "OPEN"
        const newTickets = data.filter((ticket) => ticket.status === "OPEN");
        setTickets(newTickets);
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
            <th>Created</th>
            <th>Status</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {currentTickets.map((ticket) => (
            <tr key={ticket.id}>
              <td>{ticket.id}</td>
              <td>{ticket.title}</td>
              <td>{new Date(ticket.createdDate).toLocaleDateString()}</td>
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

      {/* Pagination Controls (No Previous/Next) */}
      <div className="ui pagination menu">
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index + 1}
            className={`item ${currentPage === index + 1 ? "active" : ""}`}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NewTicketsList;
