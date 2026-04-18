const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface ApiOptions {
  method?: Method;
  body?: Record<string, unknown>;
  formData?: FormData;
}

class ApiError extends Error {
  status: number;
  data: any;
  constructor(message: string, status: number, data?: any) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = "ApiError";
  }
}

export async function api<T = any>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { method = "GET", body, formData } = options;

  const headers: Record<string, string> = {};
  if (!formData) headers["Content-Type"] = "application/json";

  // Fallback to Bearer token if cookies are blocked on localhost
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers,
    credentials: "include",
    body: formData ? formData : body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({ message: "Invalid server response" }));

  if (!res.ok) {
    throw new ApiError(data.message || "Request failed", res.status, data);
  }

  return data as T;
}

// ─── Auth API ──────────────────────────────────────────────────────────────────
export const authApi = {
  register: (payload: { name: string; email: string; password: string; phone?: string; role?: string }) =>
    api("/auth/register", { method: "POST", body: payload }),

  verifyOtp: (payload: { email: string; otp: string }) =>
    api<{ data: AuthUser }>("/auth/verify-otp", { method: "POST", body: payload }),

  resendOtp: (email: string) =>
    api("/auth/resend-otp", { method: "POST", body: { email } }),

  login: (payload: { email: string; password: string }) =>
    api<{ data: AuthUser; requiresVerification?: boolean; email?: string; accessToken?: string }>(
      "/auth/login", { method: "POST", body: payload }
    ),

  logout: () => api("/auth/logout", { method: "POST" }),

  forgotPassword: (email: string) =>
    api("/auth/forgot-password", { method: "POST", body: { email } }),

  resetPassword: (token: string, password: string) =>
    api(`/auth/reset-password/${token}`, { method: "PUT", body: { password } }),

  refreshToken: () =>
    api<{ success: boolean }>("/auth/refresh", { method: "POST" }),
};

// ─── Properties API ───────────────────────────────────────────────────────────
export const propertiesApi = {
  getAll: (params?: Record<string, string>) => {
    const query = params ? "?" + new URLSearchParams(params).toString() : "";
    return api(`/properties${query}`);
  },
  getById: (id: string) => api(`/properties/${id}`),
  create: (formData: FormData) => api("/properties", { method: "POST", formData }),
  update: (id: string, formData: FormData) => api(`/properties/${id}`, { method: "PUT", formData }),
  delete: (id: string) => api(`/properties/${id}`, { method: "DELETE" }),
  myListings: () => api<{ data: any[] }>("/properties/my-listings"),
};

// ─── User API ─────────────────────────────────────────────────────────────────
export const userApi = {
  getMe: () => api<{ data: AuthUser }>("/users/me"),
  updateMe: (formData: FormData) => api<{ data: AuthUser }>("/users/me", { method: "PUT", formData }),
  toggleFavorite: (propertyId: string) => api(`/users/favorites/${propertyId}`, { method: "POST" }),
  getFavorites: () => api("/users/favorites"),
};

// ─── Chat API ─────────────────────────────────────────────────────────────────
export const chatApi = {
  getOrCreate: (receiverId: string, propertyId?: string) =>
    api("/chat/conversations", { method: "POST", body: { receiverId, propertyId } }),
  getConversations: () => api("/chat/conversations"),
  getMessages: (conversationId: string, page = 1) =>
    api(`/chat/conversations/${conversationId}/messages?page=${page}`),
};

// ─── Admin API ────────────────────────────────────────────────────────────────
export const adminApi = {
  getStats: () => api<{ data: any }>("/admin/stats"),
  getUsers: (params?: Record<string, string>) => {
    const q = params ? "?" + new URLSearchParams(params).toString() : "";
    return api(`/admin/users${q}`);
  },
  blockUser: (id: string, isBlocked: boolean) => api(`/admin/users/${id}/block`, { method: "PUT", body: { isBlocked } }),
  getProperties: (status?: string) => api(`/admin/properties${status ? `?status=${status}` : ""}`),
  approveProperty: (id: string, payload: { status: "approved" | "rejected"; rejectionReason?: string }) =>
    api(`/admin/properties/${id}/approve`, { method: "PUT", body: payload }),
};

// ─── Types ────────────────────────────────────────────────────────────────────
export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: "user" | "owner" | "admin";
  avatar?: string;
  phone?: string;
  bio?: string;
  isVerified: boolean;
}

export { ApiError };
