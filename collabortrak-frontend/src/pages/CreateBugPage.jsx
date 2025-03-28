import React from "react";
import CreateBugForm from "../components/createBugForm/CreateBugForm"; // Import Form
import DashboardLayout from "../components/dashboardLayout/DashboardLayout"; // Import layout

const CreateBugPage = () => {
  console.log(" CreateStoryPage Rendered!");

  return (
    <DashboardLayout>
      <CreateBugForm />
    </DashboardLayout>
  );
};

export default CreateBugPage;
