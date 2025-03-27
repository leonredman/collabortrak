import React from "react";
import CreateTaskForm from "../components/createtaskForm/CreateTaskForm"; // Ensure this import exists
import DashboardLayout from "../components/dashboardLayout/DashboardLayout"; // Import layout

const CreateStoryPage = () => {
  console.log(" CreateStoryPage Rendered!");

  return (
    <DashboardLayout>
      <CreateTaskForm /> {/* Ensure StoryForm is used here */}
    </DashboardLayout>
  );
};

export default CreateStoryPage;
