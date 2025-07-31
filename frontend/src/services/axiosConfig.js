import axios from "axios";
import { toast } from "react-toastify";
import BASE_URL from "../config";

// Base URL configuration
// axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.baseURL = BASE_URL;

// Request interceptor
axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem("token");
            delete axios.defaults.headers.common["Authorization"];
            toast.error("Session expired. Please login again.");
            window.location.href = "/login";
        } else if (error.response?.status === 403) {
            toast.error("Access denied. Insufficient permissions.");
        } else if (error.response?.status >= 500) {
            toast.error("Server error. Please try again later.");
        }
        return Promise.reject(error);
    }
);

export default axios;
