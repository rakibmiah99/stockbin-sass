import type { ReactNode } from "react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard require="auth">
      <div className="flex min-h-screen flex-1 bg-background">
        <Sidebar />
        <div className="flex flex-1 flex-col">
          <Topbar />
          <main className="flex-1 p-xl">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
