import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../components/dashboardLayout/DashboardLayout"; // Import layout

const EditTicketPage = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [employees, setEmployees] = useState([]); // Store employees for dropdown
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "",
    priority: "",
    category: "",
    dueDate: "",
    assignedEmployeeId: "",
  });

  const userRole = localStorage.getItem("userRole"); // Get logged-in user role

  useEffect(() => {
    console.log("Fetching ticket with ID:", ticketId);

    fetch(`http://localhost:8080/api/tickets/${ticketId}`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Ticket data received:", data);
        setTicket(data);
        setFormData({
          title: data.title || "",
          description: data.description || "",
          status: data.status || "",
          priority: data.priority || "",
          category: data.category || "",
          dueDate: data.dueDate ? data.dueDate.split("T")[0] : "",
          assignedEmployeeId: data.assignedEmployee
            ? data.assignedEmployee.id
            : "",
        });
      })
      .catch((error) => console.error("Error fetching ticket details:", error));

    // Fetch list of employees
    fetch("http://localhost:8080/api/employees", {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Employees fetched:", data);
        setEmployees(data);
      })
      .catch((error) => console.error("Error fetching employees:", error));
  }, [ticketId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Set LocalDateTime format for update
    const formattedData = {
      ...formData,
      dueDate: formData.dueDate ? `${formData.dueDate}T00:00:00` : null,
    };

    console.log("Submitting Ticket Update Request:", formattedData); // Debug Log payload

    fetch(`http://localhost:8080/api/tickets/${ticketId}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formattedData),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((errorData) => {
            console.error("Error Response:", errorData);
            throw new Error(`Failed to update ticket: ${errorData.message}`);
          });
        }
        return res.json();
      })
      .then((updatedTicket) => {
        console.log("Ticket Updated Successfully:", updatedTicket); // Debug Log Confirm Update
        alert("Ticket updated successfully!");
        navigate("/dashboard");
      })
      .catch((error) => console.error("Error updating ticket:", error));
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this ticket?")) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/tickets/${ticketId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (response.ok) {
        alert("Ticket deleted successfully!");
        navigate("/admin-dashboard"); // Redirect after deletion
      } else {
        alert("Failed to delete ticket.");
      }
    } catch (error) {
      console.error("Error deleting ticket:", error);
    }
  };

  if (!ticket) {
    return <p>Loading ticket details...</p>;
  }

  return (
    <DashboardLayout>
      <div className="ui container" style={{ paddingTop: "10rem" }}>
        <h2>Edit Ticket</h2>

        {/* Display Read-Only Ticket Info */}
        <div className="ui segment">
          <h3>Ticket Details</h3>
          <p>
            <strong>Tracking Number:</strong> {ticket.ticketTrackingNumber}
          </p>
          <p>
            <strong>Customer:</strong> {ticket.customer.firstName}{" "}
            {ticket.customer.lastName}
          </p>
          <p>
            <strong>Email:</strong> {ticket.customer.email}
          </p>
          <p>
            <strong>Current Assigned Employee:</strong>{" "}
            {ticket.assignedEmployee
              ? `${ticket.assignedEmployee.firstName} ${ticket.assignedEmployee.lastName}`
              : "Unassigned"}
          </p>
          {/* Delete Ticket Link (Admin Only) */}
          {userRole === "[ROLE_ADMIN]" && (
            <p>
              {" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault(); // Prevents default link behavior
                  handleDelete();
                }}
                style={{
                  color: "red",
                  cursor: "pointer",
                  textDecoration: "underline",
                  fontWeight: "bold",
                }}
              >
                Delete this ticket
              </a>{" "}
            </p>
          )}
        </div>

        <form className="ui form" onSubmit={handleSubmit}>
          <div className="field">
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field">
            <label>Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="OPEN">Open</option>
              <option value="READY">Ready</option>
              <option value="BUILD_IN_PROGRESS">Build In Progress</option>
              <option value="BUILD_COMPLETE">Build Complete</option>
              <option value="READY_FOR_QA">Ready for QA</option>
              <option value="QA_IN_PROGRESS">QA In Progress</option>
              <option value="QA_NEEDS_EDITS">QA Needs Edits</option>
              <option value="QA_EDITS_COMPLETE">QA Edits Complete</option>
              <option value="QA_COMPLETE">QA Complete</option>
              <option value="PUBLISHED">Published</option>
            </select>
          </div>

          <div className="field">
            <label>Priority</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              required
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>

          <div className="field">
            <label>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="BUG">Bug</option>
              <option value="FEATURE">Feature</option>
              <option value="ENHANCEMENT">Enhancement</option>
              <option value="REVISIONS">Revisions</option>
            </select>
          </div>

          <div className="field">
            <label>Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field">
            <label>Assign Employee</label>
            <select
              name="assignedEmployeeId"
              value={formData.assignedEmployeeId}
              onChange={handleChange}
              required
            >
              <option value="">Select an employee</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.firstName} {employee.lastName} ({employee.role})
                </option>
              ))}
            </select>
          </div>

          <button className="ui button primary" type="submit">
            Save Changes
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default EditTicketPage;
