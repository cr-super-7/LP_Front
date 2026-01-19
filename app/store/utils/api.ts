import axios from "axios";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Track if we're already redirecting to prevent multiple redirects
let isRedirecting = false;

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      if (typeof window !== "undefined" && !isRedirecting) {
        isRedirecting = true;
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        
        // Use Next.js router via custom event instead of hard redirect
        // This prevents full page reload and Turbopack crashes
        const event = new CustomEvent("auth:unauthorized", {
          detail: { redirectTo: "/login" },
        });
        window.dispatchEvent(event);
        
        // Reset flag after a short delay
        setTimeout(() => {
          isRedirecting = false;
        }, 1000);
      }
    }
    return Promise.reject(error);
  }
);

export default api;

