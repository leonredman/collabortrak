import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchBarWithFilters from "../searchBarWithFilters/SearchBarWithFilters";
import "./HeaderMenu.css";

const roleIcons = {
  ROLE_ADMIN: "/adminIcon.jpg",
  ROLE_MANAGER: "/managerIcon.png",
  ROLE_DEVELOPER: "/developerIcon.png",
  ROLE_QA_AGENT: "/QAIcon.png",
  ROLE_WEBSITE_SPECIALIST: "/webSpecialistIcon.png",
};
// env. vars per enviroment dev or prod
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Header = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Guest");
  const [userRole, setUserRole] = useState("User");
  const [userProfilePic, setUserProfilePic] = useState("/default-avatar.png");

  useEffect(() => {
    const storedUserName = localStorage.getItem("userName") ?? "Guest";
    const storedUserRole = localStorage.getItem("userRole") ?? "User";

    // Remove brackets [] if they exist in userRole
    const cleanUserRole = storedUserRole.replace(/[\[\]]/g, ""); // Remove brackets

    console.log(
      "Loaded from storage → userName:",
      storedUserName,
      "userRole:",
      cleanUserRole
    );

    setUserName(storedUserName);
    setUserRole(cleanUserRole);
    setUserProfilePic(roleIcons[cleanUserRole] || "/default-avatar.png");
  }, []);

  const handleLogout = async () => {
    // const backendUrl = import.meta.env.VITE_BACKEND_URL;

    //  const backendUrl = import.meta.env.MODE === 'production'
    //   ? `https://${import.meta.env.VITE_SECURE_BACKEND_URL}`
    //   : import.meta.env.VITE_BACKEND_URL;

    console.log("Backend URL being used:", backendUrl); // Confirming correct URL

    try {
      // const response = await fetch("http://localhost:8080/api/logout", {
      // const response = await fetch(`${backendUrl}/api/logout`, {
      // console.log("Attempting logout at forced HTTPS URL");
      // "https://collabortrak-production.up.railway.app/api/logout",
      // `https://${backendUrl}/api/logout`,

      const response = await fetch(`${backendUrl}/api/logout`, {
        method: "POST",
        credentials: "include",
      });

      console.log("Fetch response:", response);

      if (response.ok) {
        console.log("Logout successful");
        localStorage.clear(); // Clears all user session data
        navigate("/login");
      } else {
        console.error("Logout failed:", response.statusText);
      }
    } catch (error) {
      console.error("Network error during logout:", error.message);
    }
  };

  return (
    <div className="fixed-header">
      <div className="ui blue inverted menu">
        <Link to="/" className="item">
          CollaborTrak
        </Link>

        {/*  <Link to="/dashboard" className="item">
          Dashboard
        </Link>*/}

        {userRole === "ROLE_ADMIN" && (
          <Link to="/create-customer" className="item">
            Create Customer
          </Link>
        )}

        <div className="ui simple dropdown item">
          Create Tickets
          <i className="dropdown icon"></i>
          <div className="menu">
            <Link to="/create-ticket" className="item">
              Create Epic (+Auto Story)
            </Link>
            <Link to="/create-story" className="item">
              Create Story
            </Link>
            <Link to="/create-task" className="item">
              Create Task
            </Link>
            <Link to="/create-bug" className="item">
              Create Bug
            </Link>
          </div>
        </div>

        {userName !== "Guest" && (
          <button onClick={handleLogout} className="ui primary button">
            Logout
          </button>
        )}

        <div
          className="right menu"
          style={{ display: "flex", alignItems: "center" }}
        >
          <SearchBarWithFilters />
          <h4
            className="ui header"
            style={{ color: "white", paddingTop: "5px", paddingRight: "20px" }}
          >
            <img
              src={userProfilePic}
              alt="User Avatar"
              className="ui tiny circular image"
              style={{ marginLeft: "40px" }}
              onError={(e) => (e.target.src = "/default-avatar.png")} // Fallback to default
            />
            <span style={{ marginLeft: "10px" }}>{userName}</span>
          </h4>
          <i
            className="bell outline icon"
            style={{ color: "white", paddingTop: "5px", paddingRight: "30px" }}
          ></i>
        </div>
      </div>
    </div>
  );
};

export default Header;
