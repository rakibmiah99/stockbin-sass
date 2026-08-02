import { LogOut } from "lucide-react";
import { logoutAction } from "@/lib/actions/auth";
import type { AuthUser } from "@/lib/api/auth";

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const initials = parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "");
  return initials.join("") || "?";
}

export function Topbar({ user }: { user: AuthUser | null }) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-surface px-xl">
      <h1 className="text-h5 font-semibold text-foreground">Dashboard</h1>
      <div className="flex items-center gap-md">
        {user && (
          <div className="hidden text-right sm:block">
            <p className="text-small font-medium text-foreground">{user.name}</p>
            <p className="text-caption capitalize text-muted">{user.role}</p>
          </div>
        )}
        <div className="flex size-9 items-center justify-center rounded-full bg-accent text-small font-semibold text-foreground">
          {user ? initialsOf(user.name) : "?"}
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex items-center gap-xs rounded-md px-sm py-xs text-small font-medium text-muted transition-colors duration-[var(--motion-duration-fast)] hover:bg-surface-secondary hover:text-foreground"
          >
            <LogOut className="size-4" />
            Logout
          </button>
        </form>
      </div>
    </header>
  );
}
