import React from "react";

const TicketsDueList = () => {
  const tickets = [
    { id: 101, title: "Fix API Bug", dueDate: "2025-03-20" },
    { id: 102, title: "UI Updates", dueDate: "2025-03-22" },
  ];

  return (
    <div className="widget">
      <h3>Active Tickets by Due Date</h3>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Due Date</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.id}>
              <td>{ticket.title}</td>
              <td>{ticket.dueDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TicketsDueList;
