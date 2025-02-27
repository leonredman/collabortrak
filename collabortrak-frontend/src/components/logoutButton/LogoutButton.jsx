import React from "react";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/logout", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        console.log("Logout successful");
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("userRole");
        navigate("/login");
      } else {
        console.error("Logout failed:", response.statusText);
      }
    } catch (error) {
      console.error("Network error during logout:", error.message);
    }
  };

  return (
    <button onClick={handleLogout} className="ui primary button">
      Logout
    </button>
  );
};

export default LogoutButton;
