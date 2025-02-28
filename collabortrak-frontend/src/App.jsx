import React from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";

import ProtectedRoute from "./components/protectedRoute/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import Dashboard from "./pages/Dashboard";
import DeveloperDashboard from "./pages/DeveloperDashboard";
import LoginPage from "./pages/Login";
import ManagerDashboard from "./pages/ManagerDashboard";
import NotAuthorized from "./pages/NotAuthorized";
import NotFound from "./pages/NotFound";
import QADashboard from "./pages/QADashboard";
import WebsiteSpecialistDashboard from "./pages/WebsiteSpecialistDashboard";

import "./App.css";

const App = () => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true"; // Corrected authentication check
  const userRole = localStorage.getItem("userRole"); // Added role retrieval

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes with Role-Based Access */}
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

        {/* Fallback for Unauthorized Access */}
        <Route path="/not-authorized" element={<NotAuthorized />} />

        {/* Fallback for Undefined Routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
