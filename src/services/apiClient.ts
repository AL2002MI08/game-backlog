import axios from "axios";
import {getStoredToken, logout } from "./authService";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
});


apiClient.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

function extractErrorMessage(error: any): string {
  const isLoginRequest = error.config?.url?.includes("/auth/login");
  const status = error.response?.status;
  const data = error.response?.data;

  if (isLoginRequest && (status === 401 || status === 400)) {
    return "Invalid email or password.";
  }

  if (status && status >= 500) {
    return "Something went wrong. Please try again later.";
  }

  if (status === 401) {
    return "Session expired. Please log in again.";
  }

  if (status === 403) {
    return "You do not have permission to perform this action.";
  }

  if (status === 404) {
    return "The requested item was not found.";
  }

  if (status === 409) {
    return data?.message || "A game with this title already exists on this platform.";
  }

  if (data?.errors && typeof data.errors === "object") {
    const errorMessages = Object.values(data.errors).flat();
    if (errorMessages.length > 0 && typeof errorMessages[0] === "string") {
      return errorMessages[0];
    }
  }

  if (data?.message && typeof data.message === "string" && !data.message.includes("Exception")) {
    return data.message;
  }

  if (status === 400) {
    return "Please check your input and try again.";
  }

  return "Unable to connect to the server. Please check your connection.";
}

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error.config?.url?.includes("/auth/login");

    if (error.response?.status === 401 && !isLoginRequest) {
      logout();
      window.location.href = "/login";
    }

    const message = extractErrorMessage(error);
    return Promise.reject(new Error(message));
  }
);
