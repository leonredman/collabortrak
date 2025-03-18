import React, { useEffect, useState } from "react";

const TicketsList = ({ title, status, category }) => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        let url = "http://localhost:8080/api/tickets";

        if (status) {
          url += `/filter?status=${status}`;
        } else if (category) {
          url += `/filter?category=${category}`;
        }

        const response = await fetch(url);
        const data = await response.json();
        setTickets(data);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };

    fetchTickets();
  }, [status, category]);

  return (
    <div className="widget">
      <h2>{title}</h2>
      <ul>
        {tickets.length > 0 ? (
          tickets.map((ticket) => (
            <li key={ticket.id}>
              <strong>{ticket.title}</strong> - {ticket.status}
            </li>
          ))
        ) : (
          <p>No tickets found</p>
        )}
      </ul>
    </div>
  );
};

export default TicketsList;
