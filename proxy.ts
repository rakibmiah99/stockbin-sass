import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SETUP_REQUIRED_COOKIE, TOKEN_COOKIE } from "@/lib/auth/constants";

const AUTH_PATHS = ["/login", "/signup", "/forgot-password"];
const SETTINGS_PATH = "/dashboard/settings";

export function proxy(request: NextRequest) {
  const token = request.cookies.get(TOKEN_COOKIE)?.value;
  const { pathname } = request.nextUrl;

  const isAuthPage = AUTH_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
  const isDashboard = pathname.startsWith("/dashboard");

  if (isDashboard && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  console.log('token', token);

  const setupRequired = request.cookies.get(SETUP_REQUIRED_COOKIE)?.value === "1";
  if (isDashboard && setupRequired && pathname !== SETTINGS_PATH) {
    return NextResponse.redirect(new URL(`${SETTINGS_PATH}?setup=1`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup", "/forgot-password"],
};
