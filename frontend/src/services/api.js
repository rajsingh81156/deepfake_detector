import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

// Add token to all requests if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  register: (data) => apiClient.post("/auth/register", data),
  login: (data) => apiClient.post("/auth/login", data),
};

// Verification APIs
export const verificationAPI = {
  verify: (formData) => {
    return apiClient.post("/verify", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  }
};

// Watermark APIs
export const watermarkAPI = {
  addWatermark: (formData) => {
    return apiClient.post("/watermark", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  }
};

export default apiClient;
