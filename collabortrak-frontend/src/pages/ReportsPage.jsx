import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "semantic-ui-react";
import DashboardLayout from "../components/dashboardLayout/DashboardLayout";
import TicketsTable from "../components/tables/TicketsTable";

const backendUrl = import.meta.env.VITE_BACKEND_URL; // import env vars

const ReportsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllTickets();
  }, []);

  const fetchAllTickets = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${backendUrl}/api/tickets`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch tickets");
      }

      const data = await response.json();
      setTickets(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: "ticketTrackingNumber", label: "Tracking Number" },
    { key: "title", label: "Title" },
    {
      key: "assignedEmployee",
      label: "Assigned Employee",
      render: (row) =>
        row.assignedEmployee
          ? `${row.assignedEmployee.firstName} ${row.assignedEmployee.lastName}`
          : "Unassigned",
    },
    { key: "ticketType", label: "Ticket Type" },
    { key: "status", label: "Status" },
  ];

  return (
    <DashboardLayout>
      <div className="main-content" style={{ paddingTop: "10rem" }}>
        <h1>Reports</h1>

        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && tickets.length > 0 && (
          <TicketsTable columns={columns} data={tickets} />
        )}

        {!loading && tickets.length === 0 && <p>No tickets available.</p>}

        <Button as={Link} to="/" primary>
          Back to Dashboard
        </Button>
      </div>
    </DashboardLayout>
  );
};

export default ReportsPage;
