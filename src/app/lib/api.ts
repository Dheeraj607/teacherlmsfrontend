import axios, { InternalAxiosRequestConfig, AxiosRequestHeaders } from "axios";

// Use environment variable for deployed API, fallback to EC2 for local
const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://d1ojm6zdv3m37g.cloudfront.net";

const api = axios.create({
  baseURL: API_URL,
});

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (token) {
      if (!config.headers) {
        config.headers = {} as AxiosRequestHeaders;
      }

      // Axios v1+ safe way to set header
      if ('set' in config.headers) {
        config.headers.set("Authorization", `Bearer ${token}`);
      } else {
        // fallback for plain object headers
        (config.headers as any)["Authorization"] = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Unauthorized! Redirecting or handling auth...");
      // Optional: redirect to login
      // if (typeof window !== "undefined") window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default api;
  





// import axios, { InternalAxiosRequestConfig } from "axios";

// // Use environment variable for deployed API, fallback to EC2 for local
// const API_URL =
//   process.env.NEXT_PUBLIC_API_URL ||
//   "https://d1ojm6zdv3m37g.cloudfront.net";

// const api = axios.create({
//   baseURL: API_URL,
// });

// // Request interceptor
// api.interceptors.request.use(
//   (config: InternalAxiosRequestConfig) => {
//     const token =
//       typeof window !== "undefined"
//         ? localStorage.getItem("accessToken")
//         : null;

//     if (token) {
//       config.headers.set("Authorization", `Bearer ${token}`);
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Response interceptor
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response && error.response.status === 401) {
//       console.warn("Unauthorized! Redirecting or handling auth...");
//       // Optional: redirect to login
//       // if (typeof window !== "undefined") window.location.href = "/";
//     }
//     return Promise.reject(error);
//   }
// );

// export default api;




// import axios, { InternalAxiosRequestConfig } from "axios";

// const api = axios.create({
//   baseURL: "http://ec2-15-206-165-29.ap-south-1.compute.amazonaws.com:3000", // change if your backend runs on another port
// });

// // ✅ Request interceptor with correct types
// api.interceptors.request.use(
//   (config: InternalAxiosRequestConfig) => {
//     const token =
//       typeof window !== "undefined"
//         ? localStorage.getItem("accessToken")
//         : null;

//     // Axios v1+ ensures config.headers is an AxiosHeaders instance
//     if (token) {
//       config.headers.set("Authorization", `Bearer ${token}`);
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // ✅ Response interceptor (optional)
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // Example: handle 401 errors globally
//     if (error.response && error.response.status === 401) {
//       console.warn("Unauthorized! Redirecting or handling auth...");
//     }
//     return Promise.reject(error);
//   }
// );

// export default api;
