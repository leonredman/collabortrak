import React from "react";
import DashboardLayout from "../components/dashboardLayout/DashboardLayout"; // Import layout
import TicketForm from "../components/ticketForm/TicketForm"; // Ensure this import exists

const CreateTicketPage = () => {
  console.log(" CreateTicketPage Rendered!");

  return (
    <DashboardLayout>
      <TicketForm /> {/* Ensure TicketForm is used here */}
    </DashboardLayout>
  );
};

export default CreateTicketPage;
