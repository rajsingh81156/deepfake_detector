import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json"
  },
  timeout: 30000 // 30 second timeout for large file uploads
});

// Add token to all requests if available
apiClient.interceptors.request.use(
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

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => apiClient.post("/auth/register", data),
  login: (data) => apiClient.post("/auth/login", data),
  logout: () => {
    localStorage.removeItem("token");
    return Promise.resolve();
  },
  getCurrentUser: () => apiClient.get("/auth/me")
};

// Verification APIs
export const verificationAPI = {
  verify: (formData) => {
    return apiClient.post("/verify", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  },
  getHistory: () => apiClient.get("/verify/history"),
  getVerificationById: (id) => apiClient.get(`/verify/${id}`)
};

// Watermark APIs
export const watermarkAPI = {
  addWatermark: (formData) => {
    return apiClient.post("/watermark", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      responseType: "blob" // For downloading watermarked files
    });
  },
  verifyWatermark: (formData) => {
    return apiClient.post("/watermark/verify", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  }
};

// Helper function to check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

// Helper function to get auth token
export const getAuthToken = () => {
  return localStorage.getItem("token");
};

// Helper function to set auth token
export const setAuthToken = (token) => {
  localStorage.setItem("token", token);
};

export default apiClient;