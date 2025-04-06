import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./LoginForm.css";

const demoCredentials = {
  admin: { username: "admin", password: "admin123", icon: "/adminIcon.jpg" },
  manager: {
    username: "manager",
    password: "manager123",
    icon: "/managerIcon.png",
  },
  developer: {
    username: "dev",
    password: "dev123",
    icon: "/developerIcon.png",
  },
  qa: { username: "qa", password: "qa123", icon: "/QAIcon.png" },
  web: { username: "web", password: "web123", icon: "/webSpecialistIcon.png" },
};

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    // const form = e.target;

    //const formData = new FormData(form);
    //const payload = new URLSearchParams(formData);

    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    // Basic validation
    if (!/^[a-zA-Z0-9]+$/.test(trimmedUsername)) {
      setError("Username must be alphanumeric with no spaces.");
      return;
    }

    if (trimmedPassword.length < 5) {
      setError("Password must be at least 6 characters.");
      return;
    }

    const payload = new URLSearchParams();
    payload.append("username", trimmedUsername);
    payload.append("password", trimmedPassword);
    const backendUrl = import.meta.env.VITE_BACKEND_URL; // import env vars

    try {
      // use env variable files set for local dev and prod enviro.. Vite will do it instead of:
      //const response = await fetch("http://localhost:8080/api/login", {

      const response = await fetch(`${backendUrl}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },

        body: payload.toString(),
        credentials: "include",
      });

      if (response.ok) {
        console.log("Front end message - Login successful");
        const data = await response.json();
        const userRole = data.role;

        // Use hardcoded credentials to determine username and profile image
        let userName = "Guest";
        let userProfilePic = "/default-avatar.png";

        if (userRole.includes("ROLE_ADMIN")) {
          userName = "Admin";
          userProfilePic = "/adminIcon.jpg";
        } else if (userRole.includes("ROLE_MANAGER")) {
          userName = "Manager";
          userProfilePic = "/managerIcon.png";
        } else if (userRole.includes("ROLE_DEVELOPER")) {
          userName = "Developer";
          userProfilePic = "/developerIcon.png";
        } else if (userRole.includes("ROLE_QA_AGENT")) {
          userName = "QA Agent";
          userProfilePic = "/QAIcon.png";
        } else if (userRole.includes("ROLE_WEBSITE_SPECIALIST")) {
          userName = "Web Specialist";
          userProfilePic = "/webSpecialistIcon.png";
        }

        // Store user details in local storage
        localStorage.setItem("userRole", userRole);

        localStorage.setItem("isAuthenticated", "true");

        localStorage.setItem("userName", userName);

        localStorage.setItem("userProfilePic", userProfilePic);

        localStorage.setItem("userId", data.id); // Store User ID

        // Redirect based on role
        switch (userRole) {
          case "[ROLE_ADMIN]":
            navigate("/admin-dashboard");
            break;
          case "[ROLE_MANAGER]":
            navigate("/manager-dashboard");
            break;
          case "[ROLE_DEVELOPER]":
            navigate("/developer-dashboard");
            break;
          case "[ROLE_QA_AGENT]":
            navigate("/qa-dashboard");
            break;
          case "[ROLE_WEBSITE_SPECIALIST]":
            navigate("/website-specialist-dashboard");
            break;
          default:
            navigate("/dashboard");
        }
      } else {
        const errorData = await response.json();
        console.error("Login failed:", errorData.message);
        setError(errorData.message || "Invalid username or password.");
      }
    } catch (error) {
      console.error("Network error:", error.message);
      setError("Network error. Please try again.");
    }
  };

  const handleDemoLogin = (role) => {
    const { username, password } = demoCredentials[role];
    setUsername(username);
    setPassword(password);
    // Automatically submit the form
    document.getElementById("login-form").requestSubmit();
  };

  return (
    <div
      className="loginContainer"
      style={{ marginLeft: "260px", marginTop: "150px", marginBottom: "50px" }}
    >
      <div className="ui grid">
        <h1>Login</h1>
        <p>Welcome back. Please login to your account</p>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <form
          className="ui form"
          onSubmit={handleSubmit}
          method="POST"
          id="login-form"
        >
          <div className="field">
            <label>USERNAME:</label>
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label>PASSWORD:</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <input type="checkbox" name="remember" /> Remember me
          </div>

          <button type="submit" className="ui primary button">
            Submit
          </button>
        </form>

        <h3>For Demo Logins - Click Icons</h3>
        <div className="demo-icons">
          {Object.keys(demoCredentials).map((role) => (
            <button
              key={role}
              onClick={() => handleDemoLogin(role)}
              className="demo-icon-btn"
            >
              <img src={demoCredentials[role].icon} alt={role} />
              <span> {role.charAt(0).toUpperCase() + role.slice(1)}</span>
            </button>
          ))}
        </div>

        <div style={{ marginTop: "20px" }}>
          <Link to="/AccountRegister" className="item">
            Register as a new User
          </Link>
        </div>

        <div style={{ marginTop: "10px" }}>
          <Link to="/ResetPassword" className="item">
            Forgot your Password?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
