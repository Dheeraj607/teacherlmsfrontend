import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", // ✅ your NestJS API
});

// 🔒 Automatically include JWT token for all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken"); // saved after login
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
