import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom"; // Import BrowserRouter
import App from "./App.jsx";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
console.log("Backend URL being used:", backendUrl);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      {" "}
      {/* Wrap App with BrowserRouter */}
      <App />
    </Router>
  </React.StrictMode>
);
