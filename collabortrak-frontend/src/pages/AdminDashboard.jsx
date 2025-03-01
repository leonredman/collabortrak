import React from "react";
import DashboardLayout from "../components/dashboardLayout/DashboardLayout";

const AdminDashboard = () => {
  return (
    <DashboardLayout>
      <div className="ui container">
        <h2>Admin Dashboard</h2>
        <p>
          Welcome to the Admin Dashboard! Here you can manage all aspects of the
          application.
        </p>

        <div className="ui cards">
          <div className="card">
            <div className="content">
              <div className="header">User Management</div>
              <div className="description">
                Create, update, and delete user accounts and manage permissions.
              </div>
            </div>
            <div className="ui bottom attached button">
              <i className="user icon"></i>
              Manage Users
            </div>
          </div>

          <div className="card">
            <div className="content">
              <div className="header">Role Management</div>
              <div className="description">
                Assign roles to users and manage role-based access.
              </div>
            </div>
            <div className="ui bottom attached button">
              <i className="key icon"></i>
              Manage Roles
            </div>
          </div>

          <div className="card">
            <div className="content">
              <div className="header">System Settings</div>
              <div className="description">
                Configure application settings and maintain system health.
              </div>
            </div>
            <div className="ui bottom attached button">
              <i className="cogs icon"></i>
              System Settings
            </div>
          </div>
        </div>
      </div>
      {/* <LogoutButton /> */}
    </DashboardLayout>
  );
};

export default AdminDashboard;
