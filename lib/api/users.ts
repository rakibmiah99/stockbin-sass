import { apiRequest } from "./client";
import type { AuthUser, UserRole } from "./auth";

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: UserRole;
  is_active?: boolean;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  role?: UserRole;
  password?: string;
  password_confirmation?: string;
}

export const usersApi = {
  list: (token: string) => apiRequest<AuthUser[]>("/users", { token }),

  get: (token: string, id: number) => apiRequest<AuthUser>(`/users/${id}`, { token }),

  create: (token: string, payload: CreateUserPayload) =>
    apiRequest<AuthUser>("/users", { method: "POST", body: payload, token }),

  update: (token: string, id: number, payload: UpdateUserPayload) =>
    apiRequest<AuthUser>(`/users/${id}`, { method: "PUT", body: payload, token }),

  updateStatus: (token: string, id: number, isActive: boolean) =>
    apiRequest<AuthUser>(`/users/${id}/status`, {
      method: "PATCH",
      body: { is_active: isActive },
      token,
    }),

  remove: (token: string, id: number) =>
    apiRequest<null>(`/users/${id}`, { method: "DELETE", token }),
};
