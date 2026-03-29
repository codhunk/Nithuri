"use client";
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { authApi, userApi, AuthUser } from "@/lib/api";

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ requiresVerification?: boolean; email?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setUser: (user: AuthUser | null) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount: silently call /users/me — the httpOnly cookie is sent automatically.
  // If the access token cookie is expired, try /auth/refresh (refresh token cookie sent too).
  const refreshUser = useCallback(async () => {
    try {
      const res = await userApi.getMe();
      setUser(res.data);
    } catch {
      // Access token expired — try silent refresh via refresh token cookie
      try {
        await authApi.refreshToken(); // backend sets a new access token cookie
        const res = await userApi.getMe();
        setUser(res.data);
      } catch {
        // Both failed — user is not authenticated
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { refreshUser(); }, [refreshUser]);

  const login = async (email: string, password: string) => {
    const res = await authApi.login({ email, password });
    // Backend sets httpOnly cookies on success — nothing to store on client
    if (res.requiresVerification) {
      return { requiresVerification: true, email: res.email };
    }
    if (res.accessToken) {
      localStorage.setItem("accessToken", res.accessToken);
    }
    setUser(res.data);
    return {};
  };

  const logout = async () => {
    try {
      await authApi.logout(); // backend clears the cookies server-side
    } catch { /* ignore network errors */ }
    localStorage.removeItem("accessToken");
    setUser(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, login, logout, refreshUser, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
