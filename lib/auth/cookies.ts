import { cookies } from "next/headers";
import { RESET_FLOW_COOKIE, SETUP_REQUIRED_COOKIE, TOKEN_COOKIE } from "./constants";

const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days, matches "remember me"
const RESET_FLOW_MAX_AGE = 60 * 10; // matches the API's 10-minute OTP expiry

function baseCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  };
}

export async function getAuthToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(TOKEN_COOKIE)?.value ?? null;
}

export async function setAuthToken(token: string, remember: boolean): Promise<void> {
  const store = await cookies();
  store.set(TOKEN_COOKIE, token, {
    ...baseCookieOptions(),
    ...(remember ? { maxAge: SESSION_MAX_AGE } : {}),
  });
}

export async function clearAuthToken(): Promise<void> {
  const store = await cookies();
  store.delete(TOKEN_COOKIE);
}

/** Tracks whether the tenant still needs to complete their shop settings after login. */
export async function setSetupRequired(required: boolean): Promise<void> {
  const store = await cookies();
  if (required) {
    store.set(SETUP_REQUIRED_COOKIE, "1", baseCookieOptions());
  } else {
    store.delete(SETUP_REQUIRED_COOKIE);
  }
}

/** Tracks which step of the forgot-password flow the user is on, across redirects. */
export type ResetFlowState =
  | { step: "otp"; email: string }
  | { step: "reset"; email: string; otp: string };

export async function getResetFlow(): Promise<ResetFlowState | null> {
  const store = await cookies();
  const raw = store.get(RESET_FLOW_COOKIE)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ResetFlowState;
  } catch {
    return null;
  }
}

export async function setResetFlow(state: ResetFlowState): Promise<void> {
  const store = await cookies();
  store.set(RESET_FLOW_COOKIE, JSON.stringify(state), {
    ...baseCookieOptions(),
    maxAge: RESET_FLOW_MAX_AGE,
  });
}

export async function clearResetFlow(): Promise<void> {
  const store = await cookies();
  store.delete(RESET_FLOW_COOKIE);
}
