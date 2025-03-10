import React, { useEffect, useState } from "react";

const NewTicketsList = () => {
  const [tickets, setTickets] = useState([]);

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

  return (
    <div className="ui green segment">
      <h3>Open Tickets</h3>
      <table className="ui celled table">
        <thead>
          <tr>
            <th>Ticket ID</th>
            <th>Title</th>
            <th>Created</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.id}>
              <td>{ticket.id}</td>
              <td>{ticket.title}</td>
              <td>{new Date(ticket.createdDate).toLocaleDateString()}</td>
              <td>{ticket.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NewTicketsList;
