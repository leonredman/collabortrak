import React, { useEffect } from "react";
import {
  Navigate,
  Route,
  Routes, // Removed BrowserRouter put in main.jsx
  useNavigate,
} from "react-router-dom";

import ProtectedRoute from "./components/protectedRoute/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import CreateTicketPage from "./pages/CreateTicketPage";
import Dashboard from "./pages/Dashboard";
import DeveloperDashboard from "./pages/DeveloperDashboard";
import EditTicketPage from "./pages/EditTicketPage";
import LoginPage from "./pages/Login";
import ManagerDashboard from "./pages/ManagerDashboard";
import NotAuthorized from "./pages/NotAuthorized";
import NotFound from "./pages/NotFound";
import QADashboard from "./pages/QADashboard";
import WebsiteSpecialistDashboard from "./pages/WebsiteSpecialistDashboard";

import "./App.css";

const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    const userRole = localStorage.getItem("userRole");
    const currentPath = window.location.pathname; // Get current URL path

    console.log(
      "useEffect triggered: isAuthenticated =",
      isAuthenticated,
      "userRole =",
      userRole
    );

    // Prevent navigation if already on /create-ticket
    if (
      isAuthenticated &&
      !["/create-ticket"].includes(currentPath) &&
      !currentPath.startsWith("/edit-ticket/")
    ) {
      console.log("Redirecting based on role...");

      // if (isAuthenticated) {

      if (userRole === "[ROLE_ADMIN]") {
        navigate("/admin-dashboard");
      } else if (userRole === "[ROLE_MANAGER]") {
        navigate("/manager-dashboard");
      } else if (userRole === "[ROLE_DEVELOPER]") {
        navigate("/developer-dashboard");
      } else if (userRole === "[ROLE_QA_AGENT]") {
        navigate("/qa-dashboard");
      } else if (userRole === "[ROLE_WEBSITE_SPECIALIST]") {
        navigate("/website-specialist-dashboard");
      } else {
        navigate("/dashboard");
      }
    }
  }, [navigate]);

  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const userRole = localStorage.getItem("userRole");

  return (
    <Routes>
      {" "}
      {/* Removed Router */}
      <Route path="/login" element={<LoginPage />} />
      {isAuthenticated ? (
        <>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute
                allowedRoles={[
                  "[ROLE_ADMIN]",
                  "[ROLE_MANAGER]",
                  "[ROLE_DEVELOPER]",
                  "[ROLE_QA_AGENT]",
                  "[ROLE_WEBSITE_SPECIALIST]",
                ]}
                userRole={userRole}
              >
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/create-ticket" element={<CreateTicketPage />} />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute
                allowedRoles={["[ROLE_ADMIN]"]}
                userRole={userRole}
              >
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/edit-ticket/:ticketId" element={<EditTicketPage />} />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute
                allowedRoles={["[ROLE_ADMIN]"]}
                userRole={userRole}
              >
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager-dashboard"
            element={
              <ProtectedRoute
                allowedRoles={["[ROLE_MANAGER]"]}
                userRole={userRole}
              >
                <ManagerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/developer-dashboard"
            element={
              <ProtectedRoute
                allowedRoles={["[ROLE_DEVELOPER]"]}
                userRole={userRole}
              >
                <DeveloperDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/qa-dashboard"
            element={
              <ProtectedRoute
                allowedRoles={["[ROLE_QA_AGENT]"]}
                userRole={userRole}
              >
                <QADashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/website-specialist-dashboard"
            element={
              <ProtectedRoute
                allowedRoles={["[ROLE_WEBSITE_SPECIALIST]"]}
                userRole={userRole}
              >
                <WebsiteSpecialistDashboard />
              </ProtectedRoute>
            }
          />
        </>
      ) : (
        <Route path="*" element={<Navigate to="/login" replace />} />
      )}
      <Route path="/not-authorized" element={<NotAuthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes> // Remove Router from here
  );
};

export default App;
