import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateBugForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [epics, setEpics] = useState([]);
  const [selectedEpicId, setSelectedEpicId] = useState("");
  const [selectedEpic, setSelectedEpic] = useState(null);
  const [priority, setPriority] = useState("MEDIUM");
  const [status, setStatus] = useState("OPEN");
  const [customerId, setCustomerId] = useState("");
  const [category] = useState("NEW_BUILD"); // default or constant for now
  const [employees, setEmployees] = useState([]);
  const [assignedEmployeeId, setAssignedEmployeeId] = useState(null);
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL; // import env vars

  useEffect(() => {
    // Fetch epics
    fetch(`${backendUrl}/api/epics`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setEpics(data);
        console.log("Epics Fetched:", data);
      })
      .catch((err) => console.error("Failed to fetch epics:", err));

    // Fetch employees
    fetch(`${backendUrl}/api/employees`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setEmployees(data);
      })
      .catch((err) => {
        console.error("Failed to fetch employees", err);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (
      !trimmedTitle ||
      !trimmedDescription ||
      !selectedEpicId ||
      !customerId
    ) {
      alert("All fields are required.");
      return;
    }

    const payload = {
      title: trimmedTitle,
      description: trimmedDescription,
      status,
      priority,
      linkedEpicId: parseInt(selectedEpicId),
      customerId: parseInt(customerId),
      ticketType: "BUG",
      category: "NEW_BUILD",
      assignedEmployeeId,
    };
    console.log("Payload:", payload);

    try {
      const res = await fetch(`${backendUrl}api/bugs/with-ticket`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        console.log("Bug created successfully.");
        // alert("Story created successfully."); // optional
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
        const error = await res.text();
        console.error("Create failed:", error);
        alert("Error: " + error);
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("Failed to submit form.");
    }
  };

  return (
    <div className="newTicketContainer" style={{ paddingTop: "10rem" }}>
      <div className="ui red raised segment">
        <form className="ui form" onSubmit={handleSubmit}>
          <h3>Create a New Bug</h3>
          {selectedEpic && (
            <div className="ui segment">
              <h4>Epic Details</h4>
              <p>
                <strong>Title:</strong> {selectedEpic.title}
              </p>
              <p>
                <strong>Priority:</strong> {selectedEpic.priority}
              </p>
              <p>
                <strong>Customer:</strong> {selectedEpic.customer?.firstName}{" "}
                {selectedEpic.customer?.lastName}
              </p>
              <p>
                <strong>Email:</strong> {selectedEpic.customer?.email}
              </p>
              <p>
                <strong>Created:</strong>{" "}
                {new Date(selectedEpic.createdDate).toLocaleDateString()}
              </p>
            </div>
          )}

          <div className="field">
            <select
              value={selectedEpicId}
              onChange={(e) => {
                const id = e.target.value;
                setSelectedEpicId(id);
                const epic = epics.find((ep) => ep.id === parseInt(id));
                setSelectedEpic(epic);
                if (epic?.customer?.id) {
                  console.log("Setting Customer ID:", epic.customer.id); // 👈 This didn’t show
                  setCustomerId(epic.customer.id);
                } else {
                  console.warn("Customer ID missing from selected epic");
                }
              }}
              required
            >
              <option value="">Select an Epic</option>
              {epics.map((epic) => (
                <option key={epic.id} value={epic.id}>
                  {epic.title} (ID: {epic.id})
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>Title</label>
            <input
              type="text"
              value={title}
              placeholder="Enter bug title"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="field">
            <label>Description</label>
            <textarea
              value={description}
              placeholder="Enter bug description"
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="field">
            <label>Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>

          <div className="field">
            <label>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="OPEN">Open</option>
              <option value="READY">Ready</option>
            </select>
          </div>
          <div className="field">
            <label>Assign To</label>
            <select
              value={assignedEmployeeId || ""}
              onChange={(e) =>
                setAssignedEmployeeId(
                  e.target.value === "" ? null : parseInt(e.target.value)
                )
              }
            >
              <option value="">Unassigned</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.firstName} {emp.lastName} (
                  {emp.role.replace("ROLE_", "")})
                </option>
              ))}
            </select>
          </div>

          <button className="ui primary button" type="submit">
            Submit Bug
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateBugForm;
