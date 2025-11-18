import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // ✅ always uses backend port
  withCredentials: true,
});

export default api;
