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

    const form = e.target;

    const formData = new FormData(form);
    const payload = new URLSearchParams(formData);

    try {
      const response = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: payload.toString(),
        credentials: "include",
      });

      if (response.ok) {
        console.log("Login successful");
        const data = await response.json();
        const userRole = data.role;

        // Store role in local storage
        localStorage.setItem("userRole", userRole);
        localStorage.setItem("isAuthenticated", "true");

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
          action="http://localhost:8080/api/login"
          id="login-form" // Add this line
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
