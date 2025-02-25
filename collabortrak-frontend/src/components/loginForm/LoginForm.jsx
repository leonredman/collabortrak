import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./LoginForm.css";

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
        localStorage.setItem("isAuthenticated", "true");

        navigate("/dashboard");
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

  return (
    <div
      className="loginContainer"
      style={{ marginLeft: "260px", marginTop: "150px", marginBottom: "50px" }}
    >
      <div className="ui grid">
        <h1>LOGIN</h1>
        <p>Welcome back. Please login to your account</p>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <form
          className="ui form"
          onSubmit={handleSubmit}
          method="POST"
          action="http://localhost:8080/api/login"
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
