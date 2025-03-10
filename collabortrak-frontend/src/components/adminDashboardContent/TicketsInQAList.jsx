import React, { useEffect, useState } from "react";

const TicketsInQAList = () => {
  const [tickets, setTickets] = useState([]);

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

  return (
    <div className="ui red segment">
      <h3>Tickets In QA</h3>
      <table className="ui celled table">
        <thead>
          <tr>
            <th>Ticket ID</th>
            <th>Title</th>
            <th>Assigned Employee</th>
            <th>Last Update</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.id}>
              <td>{ticket.id}</td>
              <td>{ticket.title}</td>
              <td>
                {ticket.assignedEmployee
                  ? `${ticket.assignedEmployee.firstName} ${ticket.assignedEmployee.lastName}`
                  : "Unassigned"}
              </td>
              <td>
                {ticket.lastUpdate
                  ? new Date(ticket.lastUpdate).toLocaleString()
                  : "No Updates"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TicketsInQAList;
