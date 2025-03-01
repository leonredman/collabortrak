import React from "react";
import Header from "../header/Header";
import SideMenu from "../sideMenu/SideMenu";

const DashboardLayout = ({ children }) => {
  return (
    <div>
      <Header />
      <div className="ui grid">
        <div className="four wide column">
          <SideMenu />
        </div>
        <div className="twelve wide column">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
