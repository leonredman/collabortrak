import React from "react";
import { Link } from "react-router-dom";
import "./sideMenu.css";

const SideMenu = () => {
  return (
    <div className="ui visible sidebar blue inverted vertical menu">
      <div className="item">
        <div className="header">Role Manager</div>
        <div className="menu">
          <Link to="/roles" className="item">
            Roles
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
        <div className="header">Reports</div>
        <div className="menu">
          <Link to="/reports/option1" className="item">
            Option 1
          </Link>
          <Link to="/reports/option2" className="item">
            Option 2
          </Link>
          <Link to="/reports/option3" className="item">
            Option 3
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SideMenu;
