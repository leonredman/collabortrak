import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditTicketPage = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "",
  });

  useEffect(() => {
    console.log("Fetching ticket with ID:", ticketId); // log to debug

    fetch(`http://localhost:8080/api/tickets/${ticketId}`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch ticket");
        return res.json(); // return JSON response
      })
      .then((data) => {
        console.log("Ticket data received:", data); //Log data
        setTicket(data);
        setFormData({
          title: data.title || "",
          description: data.description || "",
          status: data.status || "",
        });
      })
      .catch((error) => console.error("Error fetching ticket details:", error));
  }, [ticketId]);

  if (!ticket) {
    return <p>Loading ticket details...</p>;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`http://localhost:8080/api/tickets/${ticketId}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to update ticket");
        }
        return res.json();
      })
      .then(() => {
        alert("Ticket updated successfully!");
        navigate("/dashboard");
      })
      .catch((error) => console.error("Error updating ticket:", error));
  };

  if (!ticket) {
    return <p>Loading ticket details...</p>;
  }

  return (
    <div className="ui container">
      <h2>Edit Ticket</h2>
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
            <option value="BUILD_IN_PROGRESS">Build In Progress</option>
            <option value="QA_IN_PROGRESS">QA In Progress</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>
        <button className="ui button primary" type="submit">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditTicketPage;
