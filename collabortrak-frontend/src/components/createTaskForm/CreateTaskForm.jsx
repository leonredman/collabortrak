import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateTaskForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("OPEN");
  const [priority, setPriority] = useState("MEDIUM");
  const [category, setCategory] = useState("NEW_BUILD");
  const [customerId, setCustomerId] = useState("");
  const [assignedEmployeeId, setAssignedEmployeeId] = useState("");
  const [customers, setCustomers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const backendUrl = import.meta.env.VITE_BACKEND_URL; // import env vars

  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${backendUrl}/api/customers`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setCustomers(data))
      .catch((err) => console.error("Failed to fetch customers:", err));

    fetch(`${backendUrl}/api/employees`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setEmployees(data))
      .catch((err) => console.error("Failed to fetch employees:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      category,
      customerId: parseInt(customerId),
      assignedEmployeeId: assignedEmployeeId
        ? parseInt(assignedEmployeeId)
        : null,
      ticketType: "TASK",
    };

    try {
      const res = await fetch(`${backendUrl}/apitasks/with-ticket`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        navigate("/developer-dashboard");
      } else {
        const error = await res.text();
        console.error("Failed to create task:", error);
        alert("Error: " + error);
      }
    } catch (err) {
      console.error("Error submitting task:", err);
      alert("Submission failed.");
    }
  };

  return (
    <div className="newTicketContainer" style={{ paddingTop: "10rem" }}>
      <div className="ui grid">
        <div className="six wide centered column">
          <h1>Create New Task</h1>
          <div className="ui red raised segment">
            <form className="ui form" onSubmit={handleSubmit}>
              <div className="field">
                <label>Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={100}
                  required
                />
              </div>

              <div className="field">
                <label>Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={1000}
                  required
                />
              </div>

              <div className="field">
                <label>Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="OPEN">Open</option>
                  <option value="READY">Ready</option>
                  <option value="BUILD_IN_PROGRESS">Build In Progress</option>
                  <option value="BUILD_COMPLETE">Build Complete</option>
                  <option value="READY_FOR_QA">Ready for QA</option>
                  <option value="QA_EDITS_COMPLETE">QA Edits Complete</option>
                  <option value="PUBLISHED">Published</option>
                </select>
              </div>

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

              <div className="field">
                <label>Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="NEW_BUILD">New Build</option>
                  <option value="REVISIONS">Revisions</option>
                  <option value="POST_PUBLISH">Post Publish</option>
                  <option value="BUG">Bug</option>
                </select>
              </div>

              <div className="field">
                <label>Customer</label>
                <select
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  required
                >
                  <option value="">Select Customer</option>
                  {customers.map((cust) => (
                    <option key={cust.id} value={cust.id}>
                      {cust.firstName} {cust.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label>Assign To (optional)</label>
                <select
                  value={assignedEmployeeId}
                  onChange={(e) => setAssignedEmployeeId(e.target.value)}
                >
                  <option value="">Unassigned</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.firstName} {emp.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <button type="submit" className="ui primary button">
                Create Task
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskForm;
