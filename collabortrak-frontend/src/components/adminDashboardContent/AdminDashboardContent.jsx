import React, { useEffect, useState } from "react";
//import FetchTest from "../fetchTest/FetchTest";
const backendUrl = import.meta.env.VITE_BACKEND_URL; // import env vars
//const backendUrl = "https://collabortrak-production.up.railway.app";

console.log("Backend URL being used:", backendUrl);

const AdminDashboardContent = () => {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState(null);

  const testFetch = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/tickets`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
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
      setTickets(data); // Save the fetched data to state
    } catch (error) {
      console.error("Error fetching tickets:", error.message);
      setError(error.message);
    }
  };

  useEffect(() => {
    testFetch(); // Trigger the fetch when the dashboard loads
  }, []);

  return (
    <div className="ui container dashboard-container">
      <h2>Admin Dashboard</h2>
      <p>This is a minimal test to see if the fetch request works.</p>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {/*<FetchTest tickets={tickets} /> */}
    </div>
  );
};

export default AdminDashboardContent;
