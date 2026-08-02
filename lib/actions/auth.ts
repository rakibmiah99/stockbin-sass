"use server";

import { redirect } from "next/navigation";
import { authApi } from "@/lib/api/auth";
import type { ShopSettings } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import {
  clearAuthToken,
  clearResetFlow,
  getAuthToken,
  setAuthToken,
  setResetFlow,
  setSetupRequired,
} from "@/lib/auth/cookies";

/** Redirects back to `path` with `error` (and any extra params) in the query string. */
function errorRedirect(path: string, message: string, extraParams: Record<string, string> = {}): never {
  const params = new URLSearchParams({ error: message, ...extraParams });
  redirect(`${path}?${params.toString()}`);
}

function messageOf(err: unknown, fallback: string): string {
  return err instanceof ApiError ? err.message : fallback;
}

export async function loginAction(formData: FormData): Promise<void> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const remember = formData.get("remember") === "on";

  let token: string;
  let shopSettings: ShopSettings | null;
  try {
    ({ token, shop_settings: shopSettings } = await authApi.login(email, password));
  } catch (err) {
    errorRedirect("/login", messageOf(err, "Something went wrong."));
  }

  await setAuthToken(token, remember);
  await setSetupRequired(!shopSettings);
  redirect(shopSettings ? "/dashboard" : "/dashboard/settings?setup=1");
}

export async function registerAction(formData: FormData): Promise<void> {
  const name = String(formData.get("name") ?? "");
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (password !== confirmPassword) {
    errorRedirect("/signup", "Passwords do not match.");
  }
  if (password.length < 8) {
    errorRedirect("/signup", "Password must be at least 8 characters.");
  }

  let token: string;
  try {
    ({ token } = await authApi.register(name, email, password, confirmPassword));
  } catch (err) {
    errorRedirect("/signup", messageOf(err, "Something went wrong."));
  }

  await setAuthToken(token, true);
  await setSetupRequired(true);
  redirect("/dashboard/settings?setup=1");
}

export async function logoutAction(): Promise<void> {
  const token = await getAuthToken();
  if (token) {
    await authApi.logout(token).catch(() => {
      // Token may already be invalid/expired server-side — clear local state regardless.
    });
  }
  await clearAuthToken();
  await setSetupRequired(false);
  redirect("/login");
}

export async function requestOtpAction(formData: FormData): Promise<void> {
  const email = String(formData.get("email") ?? "");

  try {
    await authApi.forgotPassword(email);
  } catch (err) {
    errorRedirect("/forgot-password", messageOf(err, "Something went wrong."));
  }

  await setResetFlow({ step: "otp", email });
  redirect("/forgot-password");
}

export async function verifyOtpAction(formData: FormData): Promise<void> {
  const email = String(formData.get("email") ?? "");
  const otp = String(formData.get("otp") ?? "");

  try {
    await authApi.verifyOtp(email, otp);
  } catch (err) {
    await setResetFlow({ step: "otp", email });
    errorRedirect("/forgot-password", messageOf(err, "That code is invalid or expired."));
  }

  await setResetFlow({ step: "reset", email, otp });
  redirect("/forgot-password");
}

export async function resetPasswordAction(formData: FormData): Promise<void> {
  const email = String(formData.get("email") ?? "");
  const otp = String(formData.get("otp") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (password !== confirmPassword) {
    await setResetFlow({ step: "reset", email, otp });
    errorRedirect("/forgot-password", "Passwords do not match.");
  }
  if (password.length < 8) {
    await setResetFlow({ step: "reset", email, otp });
    errorRedirect("/forgot-password", "Password must be at least 8 characters.");
  }

  try {
    await authApi.resetPassword(email, otp, password, confirmPassword);
  } catch (err) {
    await setResetFlow({ step: "reset", email, otp });
    errorRedirect("/forgot-password", messageOf(err, "Something went wrong."));
  }

  await clearResetFlow();
  redirect("/login");
}
