import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

// Automatically add authentication headers if available
api.interceptors.request.use((config) => {
  const userRole = localStorage.getItem("userRole");
  if (userRole) {
    config.headers["Authorization"] = `Bearer ${userRole}`;
  }
  return config;
});

export default api;
