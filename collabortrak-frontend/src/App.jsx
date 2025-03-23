import React, { useEffect } from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";

import ProtectedRoute from "./components/protectedRoute/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import CreateCustomerPage from "./pages/CreateCustomerPage";
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
  const location = useLocation();

  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const userRole = localStorage.getItem("userRole");

  useEffect(() => {
    // Auto-redirect to proper dashboard after login
    const currentPath = location.pathname;

    if (
      isAuthenticated &&
      currentPath === "/" // Only redirect from root
    ) {
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
  }, [isAuthenticated, userRole, location.pathname, navigate]);

  return (
    <Routes>
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
                allowedRoles={["[ROLE_MANAGER]", "[ROLE_ADMIN]"]}
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
                allowedRoles={["[ROLE_DEVELOPER]", "[ROLE_ADMIN]"]}
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
                allowedRoles={["[ROLE_QA_AGENT]", "[ROLE_ADMIN]"]}
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
                allowedRoles={["[ROLE_WEBSITE_SPECIALIST]", "[ROLE_ADMIN]"]}
                userRole={userRole}
              >
                <WebsiteSpecialistDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/create-ticket"
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
                <CreateTicketPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-customer"
            element={
              <ProtectedRoute
                allowedRoles={["[ROLE_ADMIN]"]}
                userRole={userRole}
              >
                <CreateCustomerPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/edit-ticket/:ticketId"
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
                <EditTicketPage />
              </ProtectedRoute>
            }
          />
        </>
      ) : (
        <Route path="*" element={<Navigate to="/login" replace />} />
      )}

      <Route path="/not-authorized" element={<NotAuthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
