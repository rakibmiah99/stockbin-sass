import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { authApi } from "@/lib/api/auth";
import { clearAuthToken, getAuthToken } from "@/lib/auth/cookies";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const token = await getAuthToken();
  if (!token) redirect("/login");

  let user;
  try {
    user = await authApi.me(token);
  } catch {
    await clearAuthToken();
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen flex-1 bg-background">
      <Sidebar role={user.role} />
      <div className="flex flex-1 flex-col">
        <Topbar user={user} />
        <main className="flex-1 p-xl">{children}</main>
      </div>
    </div>
  );
}
