import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

const delay = 500;

apiClient.interceptors.request.use(async (config) => {
  if (delay > 0) {
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
  return config;
});

// Response interceptor to handle errors gracefully
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.statusText || 
      error.message ||
      "An unexpected network error occurred";
    return Promise.reject(new Error(message));
  }
);
