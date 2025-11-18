// axiosInterceptor.ts
import api from "./api";

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    error ? prom.reject(error) : prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    console.log("📤 REQUEST →", config.url, "Token:", token);

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    console.log("❌ RESPONSE 401 →", originalRequest.url);

    // Only refresh once
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Queue requests
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          console.log("🔁 Using queued token:", token);
          originalRequest.headers["Authorization"] = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        console.log("🔄 Refreshing token with:", refreshToken);

        const res = await api.post("/auth/refresh", { refreshToken });

        const newAccessToken = res.data.accessToken;

        console.log("✅ NEW access token:", newAccessToken);

        // Save + apply new token
        localStorage.setItem("accessToken", newAccessToken);
        api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);
        isRefreshing = false;

        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        console.log("🔁 Retrying request:", originalRequest.url);

        return api(originalRequest);
      } catch (err) {
        console.log("🚨 REFRESH FAILED:", err);

        processQueue(err, null);
        isRefreshing = false;

        localStorage.clear();
        window.location.href = "/";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
