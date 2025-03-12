import React from "react";
import Header from "../header/Header";
import SideMenu from "../sideMenu/SideMenu";
import "./DashboardLayout.css";

const DashboardLayout = ({ children }) => {
  return (
    <div>
      <Header />
      <div className="dashboard-container ui grid">
        <div className="three wide column sidebar-container">
          <SideMenu />
        </div>
        <div className="twelve wide column main-content">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
