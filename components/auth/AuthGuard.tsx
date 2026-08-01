"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthProvider";

/**
 * Client-side route gate. `require="guest"` bounces already-authenticated
 * users away from auth pages (login/signup/forgot-password) to /dashboard;
 * `require="auth"` bounces unauthenticated users away from protected pages
 * to /login. Renders nothing until the auth status is resolved, to avoid a
 * content flash before the redirect fires.
 */
export function AuthGuard({
  require,
  children,
}: {
  require: "guest" | "auth";
  children: React.ReactNode;
}) {
  const { status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (require === "guest" && status === "authenticated") router.replace("/dashboard");
    if (require === "auth" && status === "guest") router.replace("/login");
  }, [status, require, router]);

  const blocked =
    status === "loading" ||
    (require === "guest" && status === "authenticated") ||
    (require === "auth" && status === "guest");

  if (blocked) {
    return (
      <div className="flex min-h-screen flex-1 items-center justify-center bg-background">
        <div className="size-8 animate-spin rounded-full border-2 border-border border-t-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
