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

  const [selectedStatus, setSelectedStatus] = useState("");
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
        setSelectedStatus(data.status || "");
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

    const selectedOrCurrentStatus = selectedStatus || formData.status;

    const statusesThatAllowUnassigned = ["OPEN", "READY"];
    const isUnassigned = formData.assignedEmployeeId === "unassigned";

    // Enforce employee assignment for later statuses
    if (
      !statusesThatAllowUnassigned.includes(selectedOrCurrentStatus) &&
      isUnassigned
    ) {
      alert("Please assign an employee before changing to this status.");
      return;
    }

    const formattedData = {
      ...formData,
      status: selectedOrCurrentStatus,
      dueDate: formData.dueDate ? `${formData.dueDate}T00:00:00` : null,
      assignedEmployee:
        isUnassigned || !formData.assignedEmployeeId
          ? null
          : { id: parseInt(formData.assignedEmployeeId) },
    };

    console.log("Submitting Ticket Update Request:", formattedData);
    console.log("Final payload:", formattedData);

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
        console.log("Ticket Updated Successfully:", updatedTicket);
        alert("Ticket updated successfully!");

        // Redirect based on role
        const userRole = localStorage.getItem("userRole");
        switch (userRole) {
          case "[ROLE_ADMIN]":
            navigate("/admin-dashboard");
            break;
          case "[ROLE_MANAGER]":
            navigate("/manager-dashboard");
            break;
          case "[ROLE_DEVELOPER]":
            navigate("/developer-dashboard");
            break;
          case "[ROLE_QA_AGENT]":
            navigate("/qa-dashboard");
            break;
          case "[ROLE_WEBSITE_SPECIALIST]":
            navigate("/website-specialist-dashboard");
            break;
          default:
            navigate("/dashboard");
        }
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

  const getAllowedStatuses = (role) => {
    switch (role) {
      case "[ROLE_WEBSITE_SPECIALIST]":
        return ["OPEN", "READY", "PUBLISHED"];
      case "[ROLE_QA_AGENT]":
        return ["QA_IN_PROGRESS", "QA_NEEDS_EDITS", "QA_COMPLETE"];
      case "[ROLE_DEVELOPER]":
        return [
          "OPEN",
          "READY",
          "BUILD_IN_PROGRESS",
          "BUILD_COMPLETE",
          "READY_FOR_QA",
          "QA_EDITS_COMPLETE",
        ];
      case "[ROLE_MANAGER]":
      case "[ROLE_ADMIN]":
        return [
          "OPEN",
          "READY",
          "BUILD_IN_PROGRESS",
          "BUILD_COMPLETE",
          "READY_FOR_QA",
          "QA_IN_PROGRESS",
          "QA_NEEDS_EDITS",
          "QA_EDITS_COMPLETE",
          "QA_COMPLETE",
          "PUBLISHED",
        ];
      default:
        return [];
    }
  };

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
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
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
              </a>
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
            <p>
              <strong>Current Status:</strong>{" "}
              {formData.status.replace(/_/g, " ")}
            </p>
            <select
              name="status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              required
            >
              <option value="">If Required Select New Status</option>
              {getAllowedStatuses(userRole).map((status) => (
                <option key={status} value={status}>
                  {status.replace(/_/g, " ")}
                </option>
              ))}
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
              <option value="NEW_BUILD">New Build</option>
              <option value="REVISIONS">Revisions</option>
              <option value="POST_PUBLISH">Post Publish</option>
              <option value="BUG">Bug</option>
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
              <option value="unassigned">Unassigned</option>
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
