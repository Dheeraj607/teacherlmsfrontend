// services/api.ts
import axios from "axios";
import { startTokenRefreshTimer } from "./authTimer";

let isRefreshing = false;
let queue: any[] = [];

const processQueue = (err: any, token: string | null = null) => {
  queue.forEach((p) => {
    err ? p.reject(err) : p.resolve(token);
  });
  queue = [];
};

const api = axios.create({
  baseURL: "http://ec2-15-206-165-29.ap-south-1.compute.amazonaws.com:3000",
  headers: { "Content-Type": "application/json" },
});

// Attach access token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        console.log("❌ No refresh token — redirecting");
        window.location.href = "/";
        return;
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push({ resolve, reject });
        }).then((token) => {
          original.headers.Authorization = `Bearer ${token}`;
          return api(original);
        });
      }

      isRefreshing = true;

      try {
        const res = await axios.post("http://localhost:3000/auth/refresh", {
          refreshToken,
        });

        const newToken = res.data.accessToken;

        localStorage.setItem("accessToken", newToken);
        startTokenRefreshTimer();

        processQueue(null, newToken);

        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch (err) {
        processQueue(err, null);
        localStorage.clear();
        window.location.href = "/";
        return;
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
