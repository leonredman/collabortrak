import React from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import Dashboard from "./pages/Dashboard";
import DeveloperDashboard from "./pages/DeveloperDashboard";
import LoginPage from "./pages/Login";
import ManagerDashboard from "./pages/ManagerDashboard";
import NotFound from "./pages/NotFound";
import QADashboard from "./pages/QADashboard";
import WebsiteSpecialistDashboard from "./pages/WebsiteSpecialistDashboard";

import "./App.css";

const App = () => {
  const isAuthenticated = !!localStorage.getItem("userRole"); // Check if user is logged in

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/manager-dashboard" element={<ManagerDashboard />} />
        <Route path="/developer-dashboard" element={<DeveloperDashboard />} />
        <Route path="/qa-dashboard" element={<QADashboard />} />
        <Route
          path="/website-specialist-dashboard"
          element={<WebsiteSpecialistDashboard />}
        />

        {/* Redirect to Login if Not Authenticated */}
        {!isAuthenticated && (
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}

        {/* Fallback for Undefined Routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
