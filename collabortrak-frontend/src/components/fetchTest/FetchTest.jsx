import React, { useEffect, useState } from "react";

const FetchTest = () => {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL; // Your backend URL

  useEffect(() => {
    const fetchTickets = async () => {
      console.log("Running Fetch Test...");

      try {
        const response = await fetch(`${backendUrl}/api/tickets`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        console.log("Fetch Response Received:", response);

        if (!response.ok) {
          console.error(
            "Server returned an error:",
            response.status,
            response.statusText
          );
          throw new Error(
            `HTTP Error ${response.status}: ${response.statusText}`
          );
        }

        const data = await response.json();
        console.log("Tickets fetched successfully:", data);
        setTickets(data);
      } catch (error) {
        console.error("Error fetching tickets:", error.message);
        setError(error.message);
      }
    };

    fetchTickets();
  }, []);

  return (
    <div>
      <h1>Fetch Test</h1>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      <ul>
        {tickets.map((ticket) => (
          <li key={ticket.id}>{ticket.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default FetchTest;
