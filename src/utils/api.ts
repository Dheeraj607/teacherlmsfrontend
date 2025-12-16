import axios from "axios";
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // ✅ CloudFront URL
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
