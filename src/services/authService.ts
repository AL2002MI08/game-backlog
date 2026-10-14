import { LoginFormValues } from "@/schemas/auth";
import { apiClient } from "@/services/apiClient";
import { tokenStore } from "./tokenService";


export interface UserProfile {
  id: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
}

interface LoginResponse {
  token: string;
  expiresAt: string;
}

let session: { token: string; expiresAt: string; user: UserProfile | null } | null = null;

async function fetchProfile(token: string): Promise<UserProfile> {
  const res = await apiClient.get<UserProfile>("/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function login(userData: LoginFormValues): Promise<AuthResponse> {
  const { data } = await apiClient.post<LoginResponse>("/auth/login", {
    email: userData.email,
    password: userData.password,
  });

  session = { token: data.token, expiresAt: data.expiresAt, user: null };

  if (userData.rememberMe) {
    await tokenStore.save(JSON.stringify({ token: data.token, expiresAt: data.expiresAt }));
  } else {
    await tokenStore.clear();
  }

  const user = await fetchProfile(data.token);
  session.user = user;

  return { token: data.token, user };
}

export async function restoreSession(): Promise<AuthResponse | null> {

  for (const store of [localStorage, sessionStorage]) {
    store.removeItem("auth_token");
    store.removeItem("auth_user");
  }

  try {
    const raw = await tokenStore.get();
    if (!raw) return null;

    const { token, expiresAt } = JSON.parse(raw) as { token: string; expiresAt: string };

    if (new Date(expiresAt).getTime() <= Date.now()) {
      await tokenStore.clear();
      return null;
    }

    session = { token, expiresAt, user: null };
    const user = await fetchProfile(token); 
    session.user = user;
    return { token, user };
  } catch {
    session = null;
    await tokenStore.clear();
    return null;
  }
}

export async function logout(): Promise<void> {
  session = null;
  await tokenStore.clear();
}

export function getStoredUser(): UserProfile | null {
  return session?.user ?? null;
}

export function getStoredToken(): string | null {
  return session?.token ?? null;
}