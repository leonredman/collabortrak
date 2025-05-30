import React from "react";
import { Link } from "react-router-dom";
import "./sideMenu.css";

const SideMenu = () => {
  const userRole = localStorage.getItem("userRole");

  const isAdmin = userRole === "[ROLE_ADMIN]";

  return (
    <div className="ui visible sidebar blue inverted vertical menu">
      {isAdmin && (
        <>
          <div className="item">
            <div className="header">Role Manager</div>
            <div className="menu">
              <Link
                to="#"
                className="item hover-not-implemented"
                onClick={(e) => e.preventDefault()} // Prevents navigation
              >
                <span className="default-text">Roles</span>
              </Link>
            </div>
          </div>

          <div className="item">
            <div className="header">Manager</div>
            <div className="menu">
              <Link to="/manager-dashboard" className="item">
                Manager-Dash
              </Link>
            </div>
          </div>

          <div className="item">
            <div className="header">Website Specialist</div>
            <div className="menu">
              <Link to="/website-specialist-dashboard" className="item">
                WS1-Dash
              </Link>
            </div>
          </div>

          <div className="item">
            <div className="header">Developer Dash</div>
            <div className="menu">
              <Link to="/developer-dashboard" className="item">
                Dev-Dash
              </Link>
            </div>
          </div>

          <div className="item">
            <div className="header">QA Dash</div>
            <div className="menu">
              <Link to="/qa-dashboard" className="item">
                QA-Dash
              </Link>
            </div>
          </div>

          <div className="item">
            <div className="header">Admin Dashboard</div>
            <div className="menu">
              <Link to="/admin-dashboard" className="item">
                Admin-Dash
              </Link>
            </div>
          </div>
        </>
      )}

      {/* Reports - visible to everyone */}
      <div className="item">
        <div className="header">Reports</div>
        <div className="menu">
          <Link to="/reports" className="item">
            Main
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SideMenu;
