import React, { useEffect } from "react";
import FetchTest from "../fetchTest/FetchTest";
const backendUrl = import.meta.env.VITE_BACKEND_URL; // import env vars
console.log("Backend URL being used:", backendUrl);

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
      throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Tickets fetched successfully:", data);
  } catch (error) {
    console.error("Error fetching tickets:", error.message);
  }
};

const AdminDashboardContent = () => {
  useEffect(() => {
    testFetch(); // Trigger the test fetch when the dashboard loads
  }, []);

  return (
    <div className="ui container dashboard-container">
      <h2>Admin Dashboard</h2>
      <p>This is a minimal test to see if the fetch request works.</p>
      <FetchTest />
    </div>
  );
};

export default AdminDashboardContent;
