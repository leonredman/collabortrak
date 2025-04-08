import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_BACKEND_URL ||
    "https://collabortrak-production.up.railway.app/api",
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
