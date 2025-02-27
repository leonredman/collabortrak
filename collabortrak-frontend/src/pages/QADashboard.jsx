// QADashboard.jsx
import React from "react";
import LogoutButton from "../components/logoutButton/LogoutButton";

const QADashboard = () => {
  return (
    <div>
      <h1>Welcome to the QA Dashboard!</h1>
      <p>Confirming protected route.</p>
      <LogoutButton />
    </div>
  );
};

export default QADashboard;
