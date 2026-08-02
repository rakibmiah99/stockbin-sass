import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { authApi } from "@/lib/api/auth";
import { usersApi } from "@/lib/api/users";
import { ApiError } from "@/lib/api/client";
import { clearAuthToken, getAuthToken } from "@/lib/auth/cookies";
import { toggleUserStatusAction } from "@/lib/actions/users";
import { DeleteUserButton } from "@/components/users/DeleteUserButton";
import { Button } from "@/components/ui/Button";
import { FormError } from "@/components/ui/FormError";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Users",
};

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  const token = await getAuthToken();
  if (!token) redirect("/login");

  const me = await authApi.me(token).catch(() => null);
  if (!me) {
    await clearAuthToken();
    redirect("/login");
  }
  if (me.role !== "admin") redirect("/dashboard");

  let users: Awaited<ReturnType<typeof usersApi.list>> = [];
  let loadError: string | null = null;
  try {
    users = await usersApi.list(token);
  } catch (err) {
    loadError = err instanceof ApiError ? err.message : "Couldn't load users.";
  }

  return (
    <div className="flex flex-col gap-xl">
      <div className="flex flex-col gap-base sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-h4 font-semibold text-foreground">Users</h1>
          <p className="text-body text-muted">Manage admin, manager, and salesman accounts for your team.</p>
        </div>
        <Link href="/dashboard/users/new">
          <Button>
            <Plus className="size-4" />
            Add user
          </Button>
        </Link>
      </div>

      <FormError message={error ?? null} />

      {loadError ? (
        <FormError message={loadError} />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border bg-surface">
          <table className="w-full text-left text-body">
            <thead className="border-b border-divider text-small text-muted">
              <tr>
                <th className="px-lg py-sm font-medium">Name</th>
                <th className="px-lg py-sm font-medium">Email</th>
                <th className="px-lg py-sm font-medium">Role</th>
                <th className="px-lg py-sm font-medium">Status</th>
                <th className="px-lg py-sm text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-divider last:border-0">
                  <td className="px-lg py-base font-medium text-foreground">{user.name}</td>
                  <td className="px-lg py-base text-muted">{user.email}</td>
                  <td className="px-lg py-base capitalize text-muted">{user.role}</td>
                  <td className="px-lg py-base">
                    <span
                      className={cn(
                        "rounded-full px-sm py-xs text-caption font-medium",
                        user.is_active ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
                      )}
                    >
                      {user.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-lg py-base">
                    <div className="flex items-center justify-end gap-sm">
                      <Link
                        href={`/dashboard/users/${user.id}/edit`}
                        className="rounded-md px-sm py-xs text-small font-medium text-primary hover:bg-surface-secondary"
                      >
                        Edit
                      </Link>
                      <form action={toggleUserStatusAction.bind(null, user.id, !user.is_active)}>
                        <button
                          type="submit"
                          disabled={user.id === me.id}
                          title={user.id === me.id ? "You can't deactivate your own account" : undefined}
                          className="rounded-md px-sm py-xs text-small font-medium text-muted transition-colors duration-[var(--motion-duration-fast)] hover:bg-surface-secondary hover:text-foreground disabled:cursor-not-allowed disabled:text-disabled-foreground disabled:hover:bg-transparent"
                        >
                          {user.is_active ? "Deactivate" : "Activate"}
                        </button>
                      </form>
                      <DeleteUserButton userId={user.id} disabled={user.id === me.id} />
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-lg py-xl text-center text-muted">
                    No users yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
