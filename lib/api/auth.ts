import { apiRequest } from "./client";
import { getToken } from "@/lib/auth/session";

export type UserRole = "admin" | "manager" | "salesman";

export interface AuthUser {
  id: number;
  tenant_id: number;
  name: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  pin_login: boolean;
  pin: string | null;
  has_pin: boolean;
}

export interface ShopSettings {
  id: number;
  tenant_id: number;
  shop_logo: string | null;
  shop_name: string;
  shop_email: string;
  shop_phone: string;
  shop_address: string;
  vat_percent: string;
  low_stock_threshold: number;
  currency_symbol: string;
  invoice_type: string;
}

export interface LoginResult {
  token: string;
  role: UserRole;
  shop_settings: ShopSettings | null;
}

export interface RegisterResult {
  token: string;
  role: UserRole;
}

export const authApi = {
  register: (name: string, email: string, password: string, passwordConfirmation: string) =>
    apiRequest<RegisterResult>("/auth/register", {
      method: "POST",
      body: { name, email, password, password_confirmation: passwordConfirmation },
    }),

  login: (email: string, password: string) =>
    apiRequest<LoginResult>("/auth/login", {
      method: "POST",
      body: { email, password },
    }),

  forgotPassword: (email: string) =>
    apiRequest<null>("/auth/forgot-password", {
      method: "POST",
      body: { email },
    }),

  verifyOtp: (email: string, otp: string) =>
    apiRequest<null>("/auth/verify-otp", {
      method: "POST",
      body: { email, otp },
    }),

  resetPassword: (email: string, otp: string, password: string, passwordConfirmation: string) =>
    apiRequest<null>("/auth/reset-password", {
      method: "POST",
      body: { email, otp, password, password_confirmation: passwordConfirmation },
    }),

  logout: () =>
    apiRequest<null>("/auth/logout", {
      method: "POST",
      body: {},
      token: getToken(),
    }),

  me: () => apiRequest<AuthUser>("/user", { token: getToken() }),
};
