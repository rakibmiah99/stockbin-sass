import { cache } from "react";
import { apiRequest } from "./client";
import {AuthUserType, LoginResultType, RegisterResultType} from "@/types/AuthType";

export const authApi = {
  register: (name: string, email: string, password: string, passwordConfirmation: string) =>
    apiRequest<RegisterResultType>("/auth/register", {
      method: "POST",
      body: { name, email, password, password_confirmation: passwordConfirmation },
    }),

  login: (email: string, password: string) =>
    apiRequest<LoginResultType>("/auth/login", {
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

  logout: (token: string) =>
    apiRequest<null>("/auth/logout", {
      method: "POST",
      body: {},
      token,
    }),

  // Cached per request so a layout + page that both need the current user (e.g. for an
  // admin-only gate) share one call instead of racing two independent fetches to /user.
  me: cache((token: string) => apiRequest<AuthUserType>("/user", { token })),
};
