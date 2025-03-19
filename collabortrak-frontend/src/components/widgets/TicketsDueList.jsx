import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const TicketsDueList = () => {
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
        console.log("Tickets Data Received:", data);

        // Filter active tickets and sort by due date (ascending)
        const activeTickets = data
          .filter((ticket) => ticket.status !== "RESOLVED") // Exclude resolved tickets
          .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)); // Sort by due date

        setTickets(activeTickets);
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
      <h3>Active Tickets by Due Date</h3>
      <table className="ui celled table">
        <thead>
          <tr>
            <th>Ticket Tracking #</th>
            <th>Title</th>
            <th>Category</th>
            <th>Due Date</th>
            <th>Assigned Employee</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {currentTickets.length > 0 ? (
            currentTickets.map((ticket) => (
              <tr key={ticket.id}>
                <td>{ticket.ticketTrackingNumber}</td>
                <td>{ticket.title}</td>
                <td>{ticket.category}</td>
                <td>
                  {ticket.dueDate
                    ? new Date(ticket.dueDate).toLocaleDateString()
                    : "No Due Date"}
                </td>
                <td>
                  {ticket.assignedEmployeeFirstName
                    ? `${ticket.assignedEmployeeFirstName} ${ticket.assignedEmployeeLastName}`
                    : "Unassigned"}
                </td>
                <td>
                  <Link to={`/edit-ticket/${ticket.id}`}>
                    <i className="edit icon"></i>
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No active tickets found</td>
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

export default TicketsDueList;
