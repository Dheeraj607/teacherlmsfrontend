import axios, { InternalAxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: "http://ec2-13-234-30-113.ap-south-1.compute.amazonaws.com:3000", // change if your backend runs on another port
});

// ✅ Request interceptor with correct types
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    // Axios v1+ ensures config.headers is an AxiosHeaders instance
    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor (optional)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Example: handle 401 errors globally
    if (error.response && error.response.status === 401) {
      console.warn("Unauthorized! Redirecting or handling auth...");
    }
    return Promise.reject(error);
  }
);

export default api;
