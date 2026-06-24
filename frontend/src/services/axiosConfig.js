import axios from "axios";
import { toast } from "react-toastify";
import BASE_URL from "../config";

const api = axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
});

// Attach token from localStorage on every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error),
);

// Global response error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        const message = error.response?.data?.message;

        console.log( error.response?.data);

        if (status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            toast.error(message || "Session expired. Please log in again.");
            // Let the ProtectedRoute redirect naturally on re-render
            window.dispatchEvent(new Event("auth:expired"));
        } else if (status === 403) {
            toast.error(message || "Access denied.");
        } else if (status >= 500) {
            toast.error(message || "Server error. Please try again later.");
        }

        return Promise.reject(error);
    },
);

export default api;

// // axiosConfig.js
// import axios from "axios";
// import { toast } from "react-toastify";
// import BASE_URL from "../config";

// // Base URL configuration
// // axios.defaults.baseURL = "http://localhost:8000";
// axios.defaults.baseURL = BASE_URL;

// // Request interceptor
// axios.interceptors.request.use(
//     (config) => {
//         const token = localStorage.getItem("token");
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );

// // Response interceptor
// axios.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         if (error.response?.status === 401) {
//             // Token expired or invalid
//             localStorage.removeItem("token");
//             delete axios.defaults.headers.common["Authorization"];
//             toast.error("Session expired. Please login again.");
//             window.location.href = "/login";
//         } else if (error.response?.status === 403) {
//             toast.error("Access denied. Insufficient permissions.");
//         } else if (error.response?.status >= 500) {
//             toast.error("Server error. Please try again later.");
//         }
//         return Promise.reject(error);
//     }
// );

// export default axios;

// import axios from "axios";
// import { toast } from "react-toastify";
// import BASE_URL from "../config";

// // Create axios instance with session-based configuration
// const axiosInstance = axios.create({
//     baseURL: BASE_URL,
//     withCredentials: true, // Critical: sends cookies with every request
//     headers: {
//         'Content-Type': 'application/json',
//     }
// });

// // Request interceptor - No longer needed for token management
// // But kept for potential future use (logging, etc.)
// axiosInstance.interceptors.request.use(
//     (config) => {
//         // Sessions are handled automatically via cookies
//         // No need to manually add Authorization header
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );

// // Response interceptor - Handle session expiration and errors
// axiosInstance.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         if (error.response?.status === 401) {
//             // Session expired or unauthorized
//             toast.error("Session expired. Please login again.");

//             // Clear any local storage data
//             localStorage.clear();

//             // Determine which login page to redirect to based on current path
//             const currentPath = window.location.pathname;
//             let loginPath = '/login/scholar'; // default

//             if (currentPath.startsWith('/staff')) {
//                 loginPath = '/login/staff';
//             } else if (currentPath.startsWith('/admin')) {
//                 loginPath = '/login/admin';
//             } else if (currentPath.startsWith('/scholar')) {
//                 loginPath = '/login/scholar';
//             }

//             // Only redirect if not already on login page
//             if (!currentPath.startsWith('/login')) {
//                 window.location.href = loginPath;
//             }
//         } else if (error.response?.status === 403) {
//             toast.error("Access denied. Insufficient permissions.");
//         } else if (error.response?.status >= 500) {
//             toast.error("Server error. Please try again later.");
//         }

//         return Promise.reject(error);
//     }
// );

// export default axiosInstance;
