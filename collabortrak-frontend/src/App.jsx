import React from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/Login";
import NotFound from "./pages/NotFound";

import "./App.css";

const App = () => {
  const isAuthenticated = !!localStorage.getItem("userRole"); // Check if user is logged in

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Fallback for Undefined Routes */}
        <Route path="*" element={<NotFound />} />

        {/* Redirect to Login if Not Authenticated */}
        {!isAuthenticated && (
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </Router>
  );
};

export default App;
