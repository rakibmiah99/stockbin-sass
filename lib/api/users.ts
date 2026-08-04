import { apiRequest } from "./client";
import type { AuthUserType, UserRoleType } from "@/types/AuthType";

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: UserRoleType;
  is_active?: boolean;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  role?: UserRoleType;
  password?: string;
  password_confirmation?: string;
}

export const usersApi = {
  list: (token: string) => apiRequest<AuthUserType[]>("/users", { token }),

  get: (token: string, id: number) => apiRequest<AuthUserType>(`/users/${id}`, { token }),

  create: (token: string, payload: CreateUserPayload) =>
    apiRequest<AuthUserType>("/users", { method: "POST", body: payload, token }),

  update: (token: string, id: number, payload: UpdateUserPayload) =>
    apiRequest<AuthUserType>(`/users/${id}`, { method: "PUT", body: payload, token }),

  updateStatus: (token: string, id: number, isActive: boolean) =>
    apiRequest<AuthUserType>(`/users/${id}/status`, {
      method: "PATCH",
      body: { is_active: isActive },
      token,
    }),

  remove: (token: string, id: number) =>
    apiRequest<null>(`/users/${id}`, { method: "DELETE", token }),
};
