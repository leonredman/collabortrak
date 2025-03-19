import React, { useEffect, useState } from "react";

const TicketsList = ({ title, status, category, assignedTo }) => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        let url = "http://localhost:8080/api/tickets";

        const userId = localStorage.getItem("userId"); // Get logged-in user's ID

        if (status) {
          url += `/filter?status=${status}`;
        } else if (category) {
          url += `/filter?category=${category}`;
        } else if (assignedTo) {
          url += `/employee/${userId}`; // Fetch tickets assigned to the logged-in user
        }

        const response = await fetch(url, {
          credentials: "include",
        });

        if (!response.ok) throw new Error("Failed to fetch tickets");

        const data = await response.json();
        setTickets(data);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };

    fetchTickets();
  }, [status, category, assignedTo]);

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
