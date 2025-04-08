import React from "react";

const FetchTest = ({ tickets }) => {
  return (
    <div>
      <h1>Fetch Test</h1>
      <ul>
        {tickets.length > 0 ? (
          tickets.map((ticket) => <li key={ticket.id}>{ticket.title}</li>)
        ) : (
          <p>No tickets found or failed to fetch data.</p>
        )}
      </ul>
    </div>
  );
};

export default FetchTest;
