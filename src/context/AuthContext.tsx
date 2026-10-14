import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { LoginFormValues } from "@/schemas/auth";
import { UserProfile,login as loginApi,logout as logoutApi, restoreSession } from "@/services/authService";

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginFormValues) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

useEffect(() => {
  let cancelled = false;

  const checkAuth = async () => {
    try {
      const auth = await restoreSession();
      if (!cancelled && auth) setUser(auth.user);
    } finally {
      if (!cancelled) setIsLoading(false);
    }
  };

  checkAuth();
  return () => {
    cancelled = true;
  };
}, []);

const login = async (credentials: LoginFormValues) => {
  const res = await loginApi(credentials);
  setUser(res.user);
};

const logout = async () => {
  await logoutApi();
  setUser(null);
};

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("No context provider specified");
  }
  return context;
}
