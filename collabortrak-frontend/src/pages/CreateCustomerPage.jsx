import React from "react";
import CreateCustomerForm from "../components/createCustomerForm/CreateCustomerForm";
import DashboardLayout from "../components/dashboardLayout/DashboardLayout";

const CreateCustomerPage = () => {
  return (
    <DashboardLayout>
      <div className="ui container" style={{ paddingTop: "10rem" }}>
        <CreateCustomerForm />
      </div>
    </DashboardLayout>
  );
};

export default CreateCustomerPage;
