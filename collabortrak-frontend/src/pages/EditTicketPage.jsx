import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Form,
  Grid,
  Header,
  Label,
  List,
  Segment,
} from "semantic-ui-react";
import DashboardLayout from "../components/dashboardLayout/DashboardLayout";

const EditTicketPage = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [employees, setEmployees] = useState([]);
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
  const userRole = localStorage.getItem("userRole");

  useEffect(() => {
    fetch(`http://localhost:8080/api/tickets/${ticketId}`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
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
      });

    fetch("http://localhost:8080/api/employees", {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => setEmployees(data));
  }, [ticketId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedTitle = formData.title.trim();
    const trimmedDescription = formData.description.trim();
    const selectedOrCurrentStatus = selectedStatus || formData.status;
    const statusesThatAllowUnassigned = ["OPEN", "READY"];
    const isUnassigned = formData.assignedEmployeeId === "unassigned";

    if (
      !statusesThatAllowUnassigned.includes(selectedOrCurrentStatus) &&
      isUnassigned
    ) {
      alert("Please assign an employee before changing to this status.");
      return;
    }

    const formattedData = {
      ...formData,
      title: trimmedTitle,
      description: trimmedDescription,
      dueDate: formData.dueDate ? `${formData.dueDate}T00:00:00` : null,
      status: selectedOrCurrentStatus,
      assignedEmployee:
        isUnassigned || !formData.assignedEmployeeId
          ? null
          : { id: parseInt(formData.assignedEmployeeId) },
    };

    fetch(`http://localhost:8080/api/tickets/${ticketId}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formattedData),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((errorData) => {
            throw new Error(`Failed to update ticket: ${errorData.message}`);
          });
        }
        return res.json();
      })
      .then((updatedTicket) => {
        alert("Ticket updated successfully!");
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
    if (!window.confirm("Are you sure you want to delete this ticket?")) return;

    const res = await fetch(`http://localhost:8080/api/tickets/${ticketId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (res.ok) {
      alert("Ticket deleted successfully!");
      navigate("/admin-dashboard");
    } else {
      alert("Failed to delete ticket.");
    }
  };

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

  if (!ticket) return <p>Loading ticket details...</p>;

  return (
    <DashboardLayout>
      <div className="ui container" style={{ paddingTop: "10rem" }}>
        <Header as="h1">{formData.title}</Header>
        <Grid>
          <Grid.Row>
            <Grid.Column width={10}>
              <Segment>
                <Header as="h3">Description</Header>
                <p>{formData.description}</p>
              </Segment>

              {ticket.linkedTickets?.length > 0 && (
                <Segment>
                  <Header as="h4">Linked Tickets</Header>
                  <List divided relaxed>
                    {ticket.linkedTickets.map((linked) => (
                      <List.Item key={linked.id}>
                        <List.Icon
                          name="linkify"
                          size="large"
                          verticalAlign="middle"
                        />
                        <List.Content>
                          <List.Header>
                            {linked.ticketTrackingNumber}
                          </List.Header>
                          <List.Description>{linked.title}</List.Description>
                        </List.Content>
                      </List.Item>
                    ))}
                  </List>
                </Segment>
              )}

              <Form className="ui form" onSubmit={handleSubmit}>
                <Form.Field>
                  <label>Status</label>
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
                </Form.Field>

                <Form.Field>
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
                </Form.Field>

                <Form.Field>
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
                </Form.Field>

                <Form.Field>
                  <label>Due Date</label>
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    required
                  />
                </Form.Field>

                <Form.Field>
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
                        {employee.firstName} {employee.lastName} (
                        {employee.role})
                      </option>
                    ))}
                  </select>
                </Form.Field>

                <Button type="submit" primary>
                  Save Changes
                </Button>
              </Form>
            </Grid.Column>

            <Grid.Column width={6}>
              <Segment>
                <Header as="h4">Details</Header>
                <List>
                  <List.Item>
                    <Label horizontal>Type</Label>
                    {ticket.ticketType}
                  </List.Item>
                  <List.Item>
                    <Label horizontal>Created</Label>
                    {new Date(ticket.createdDate).toLocaleString()}
                  </List.Item>
                  <List.Item>
                    <Label horizontal>Updated</Label>
                    {new Date(ticket.lastUpdate).toLocaleString()}
                  </List.Item>
                  <List.Item>
                    <Label horizontal>Assigned</Label>
                    {ticket.assignedEmployee
                      ? `${ticket.assignedEmployee.firstName} ${ticket.assignedEmployee.lastName}`
                      : "Unassigned"}
                  </List.Item>
                  <List.Item>
                    <Label horizontal>Customer</Label>
                    {ticket.customer.firstName} {ticket.customer.lastName}
                  </List.Item>
                  <List.Item>
                    <Label horizontal>Email</Label>
                    {ticket.customer.email}
                  </List.Item>
                </List>
                {userRole === "[ROLE_ADMIN]" && (
                  <p style={{ marginTop: "1rem" }}>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleDelete();
                      }}
                      style={{ color: "red", fontWeight: "bold" }}
                    >
                      Delete this ticket
                    </a>
                  </p>
                )}
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    </DashboardLayout>
  );
};

export default EditTicketPage;
