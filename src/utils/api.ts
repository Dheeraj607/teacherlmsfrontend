import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://d1ojm6zdv3m37g.cloudfront.net";

const api = axios.create({
  baseURL: API_URL,
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
