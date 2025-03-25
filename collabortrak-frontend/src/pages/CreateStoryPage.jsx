import React from "react";
import DashboardLayout from "../components/dashboardLayout/DashboardLayout"; // Import layout
import StoryForm from "../components/storyForm/StoryForm"; // Ensure this import exists

const CreateStoryPage = () => {
  console.log(" CreateStoryPage Rendered!");

  return (
    <DashboardLayout>
      <StoryForm /> {/* Ensure StoryForm is used here */}
    </DashboardLayout>
  );
};

export default CreateStoryPage;
