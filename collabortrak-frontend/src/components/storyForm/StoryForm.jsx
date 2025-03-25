import React, { useEffect, useState } from "react";

const StoryForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [epics, setEpics] = useState([]);
  const [selectedEpicId, setSelectedEpicId] = useState("");
  const [selectedEpic, setSelectedEpic] = useState(null);
  const [priority, setPriority] = useState("MEDIUM");
  const [status, setStatus] = useState("OPEN");
  const [customerId, setCustomerId] = useState("");
  const [category] = useState("NEW_BUILD"); // default or constant for now

  useEffect(() => {
    fetch("http://localhost:8080/api/epics", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setEpics(data);
        console.log("Epics Fetched:", data);
      })
      .catch((err) => console.error("Failed to fetch epics:", err));
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
      ticketType: "STORY",
      category,
    };

    try {
      const res = await fetch("http://localhost:8080/api/stories/with-ticket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Story created successfully.");
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
          <h3>Create a New Story</h3>

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
              placeholder="Enter story title"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="field">
            <label>Description</label>
            <textarea
              value={description}
              placeholder="Enter story description"
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

          <button className="ui primary button" type="submit">
            Submit Story
          </button>
        </form>
      </div>
    </div>
  );
};

export default StoryForm;
