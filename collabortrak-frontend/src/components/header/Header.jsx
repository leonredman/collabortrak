import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/logout", {
        method: "POST",
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
    <div className="ui blue inverted menu">
      <Link to="/" className="item">
        CollaborTrak
      </Link>

      <Link to="/dashboard" className="item">
        Dashboard
      </Link>

      <button
        onClick={handleLogout}
        className="ui primary button"
        style={{ marginLeft: "auto", marginRight: "20px" }}
      >
        Logout
      </button>

      <div className="right menu">
        <h4
          className="ui header"
          style={{ color: "white", paddingTop: "10px", paddingRight: "20px" }}
        >
          <img
            src="https://semantic-ui.com/images/avatar2/small/matthew.png"
            alt="placeholder"
            className="ui tiny circular image"
          />
        </h4>
        <i
          className="bell outline icon"
          style={{ color: "white", paddingTop: "10px", paddingRight: "30px" }}
        ></i>
      </div>
    </div>
  );
};

export default Header;
