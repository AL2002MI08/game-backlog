import { LoginFormValues } from "@/schemas/auth";
import { apiClient } from "@/services/apiClient";

export interface UserProfile {
  id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
}

const AUTH_TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

export async function login(userData: LoginFormValues): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>("/auth/login", userData);
  const data = response.data;
  const storage = userData.rememberMe ? localStorage : sessionStorage;
  storage.setItem(AUTH_TOKEN_KEY, data.token);
  storage.setItem(USER_KEY, JSON.stringify(data.user));
  return data;
}

export function logout(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(AUTH_TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
}

export function getStoredUser(): UserProfile | null {
  const rawUser = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
  if (!rawUser) return null;
  try {
    return JSON.parse(rawUser);
  } catch {
    return null;
  }
}

export function getStoredToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY) || sessionStorage.getItem(AUTH_TOKEN_KEY);
}