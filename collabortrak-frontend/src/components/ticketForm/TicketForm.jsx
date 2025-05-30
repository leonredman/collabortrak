import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL; // import env vars

const TicketForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("OPEN");
  const [priority, setPriority] = useState("MEDIUM");
  const [category, setCategory] = useState("");
  const [customerID, setCustomerID] = useState("");
  const [assignedEmployee, setAssignedEmployee] = useState("");
  const [customers, setCustomers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [ticketType, setTicketType] = useState("EPIC"); // Default to EPIC
  const [selectedEpicID, setSelectedEpicID] = useState("");
  const [tickets, setTickets] = useState([]);
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole");

  // **Role-Based Category Options**
  const categoryOptions = () => {
    switch (userRole) {
      case "[ROLE_ADMIN]":
        return ["NEW_BUILD", "REVISIONS", "POST_PUBLISH", "BUG"]; // Admin sees all categories
      case "[ROLE_WEBSITE_SPECIALIST]":
        return ["NEW_BUILD", "REVISIONS", "POST_PUBLISH"];
      case "[ROLE_DEVELOPER]":
        return ["BUG"];
      case "[ROLE_QA_AGENT]":
        return ["BUG"];
      default:
        return [];
    }
  };

  useEffect(() => {
    console.log(" useEffect in TicketForm triggered!"); // Logs when API calls start

    // fetch customers
    fetch(`${backendUrl}/api/customers`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch customers");
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          console.log("Customers Fetched:", data);
          setCustomers(data);
        } else {
          console.warn("Unexpected data format for customers:", data);
          setCustomers([]); // fallback
        }
      })
      .catch((err) => console.error("Customer API failed:", err));

    // fetch  Employees
    fetch(`${backendUrl}/api/employees`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Employees Fetched:", data);
        setEmployees(data);
      })
      .catch((err) => console.error("Employee API failed:", err));

    // fetch tickets for epic drop down filters
    fetch(`${backendUrl}/api/tickets`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Tickets fetched:", data);
        setTickets(data);

        // Debug to see Epics only
        const epicsOnly = data.filter((t) => t.ticketType === "EPIC");
        console.log("Epics found:", epicsOnly);
      })
      .catch((err) => console.error("Failed to fetch tickets:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (!trimmedTitle || !trimmedDescription) {
      alert("An Empty Title or Description or just spaces are not allowed.");
      return;
    }

    // updated to trim input on change for input validations
    const ticketData = {
      title: trimmedTitle,
      description: trimmedDescription,
      status,
      priority,
      category,
      customer: { id: parseInt(customerID) },
      assignedEmployee: assignedEmployee
        ? { id: parseInt(assignedEmployee) }
        : null,
      ticketType: "EPIC",
    };

    // include only if a Story is being created
    // if (ticketType === "STORY" && selectedEpicID) {
    //   ticketData.linkedEpicId = parseInt(selectedEpicID);
    // }

    console.log(
      "Ticket Data being sent to API:",
      JSON.stringify(ticketData, null, 2)
    ); // Debug log

    try {
      const response = await fetch(`${backendUrl}/api/tickets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(ticketData),
      });

      if (response.ok) {
        console.log("Ticket created successfully");

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
      } else {
        const errorData = await response.json();
        console.error("Error creating ticket:", errorData.message);
      }
    } catch (error) {
      console.error("Network error:", error.message);
    }
  };

  return (
    <div className="newTicketContainer" style={{ paddingTop: "10rem" }}>
      <div className="ui grid">
        <div className="ui row">
          <div className="six wide centered column">
            <h1>Create A New Epic</h1>
            <p>This form create a new epic and the first default story.</p>
          </div>
        </div>

        <div className="seven wide centered column">
          <div className="ui red raised segment">
            <form className="ui form" onSubmit={handleSubmit}>
              {/* Title */}
              <div className="field">
                <label>Title</label>
                <input
                  type="text"
                  placeholder="Enter ticket title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={100}
                  required
                />
              </div>

              {/* Description */}
              <div className="field">
                <label>Description</label>
                <textarea
                  placeholder="Describe the issue"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={1000}
                  required
                />
              </div>

              {/* Status */}
              <div className="field">
                <label>Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="OPEN">Open</option>
                  <option value="READY">Ready</option>
                </select>
              </div>

              {/* Priority */}
              <div className="field">
                <label>Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </select>
              </div>

              {/* Category (Role Restricted) */}
              <div className="field">
                <label>Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="">Select Category</option>
                  {categoryOptions().map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Customer Selection */}
              <div className="field">
                <label>Customer</label>
                <select
                  value={customerID}
                  onChange={(e) => setCustomerID(e.target.value)}
                  required
                >
                  <option value="">Select Customer</option>
                  {Array.isArray(customers) && customers.length > 0 ? (
                    customers.map((cust) => (
                      <option key={cust.id} value={cust.id}>
                        {cust.firstName} {cust.lastName} (ID: {cust.id})
                      </option>
                    ))
                  ) : (
                    <option disabled>No customers found</option>
                  )}
                </select>
              </div>

              {/* Assigned Employee Selection */}
              <div className="field">
                <label>Assign To (Optional)</label>
                <select
                  value={assignedEmployee}
                  onChange={(e) => setAssignedEmployee(e.target.value)}
                >
                  <option value="">Unassigned</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.firstName} {emp.lastName} (ID: {emp.id})
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit Button */}
              <button className="ui primary button" type="submit">
                Submit Ticket
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketForm;
