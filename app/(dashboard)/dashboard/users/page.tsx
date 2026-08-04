import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";

import { authApi } from "@/lib/api/auth";
import { usersApi } from "@/lib/api/users";
import { ApiError, UnauthenticatedError } from "@/lib/api/client";

import { getAuthToken, clearAuthToken } from "@/lib/auth/cookies";
import { toggleUserStatusAction } from "@/lib/actions/users";

import { DeleteUserButton } from "@/components/users/DeleteUserButton";
import { Button } from "@/components/ui/Button";
import { FormError } from "@/components/ui/FormError";

import { cn } from "@/lib/utils";
import { AuthUserType } from "@/types/AuthType";

export const metadata: Metadata = {
    title: "Users",
};

export default async function UsersPage({
                                            searchParams,
                                        }: {
    searchParams: Promise<{ error?: string }>;
}) {
    const { error } = await searchParams;

    // --------------------------------------------------
    // Authentication
    // --------------------------------------------------

    const token = await getAuthToken();

    if (!token) {
        redirect("/login");
    }

    const me = await authApi.me(token).catch((error) => {
        if (error instanceof UnauthenticatedError) {
            return null;
        }

        throw error;
    });

    if (!me) {
        await clearAuthToken();
        redirect("/login");
    }

    if (me.role !== "admin") {
        redirect("/dashboard");
    }

    // --------------------------------------------------
    // Load Users
    // --------------------------------------------------

    let users: AuthUserType[] = [];
    let loadError: string | null = null;

    try {
        users = await usersApi.list(token);
    } catch (error) {
        if (error instanceof ApiError) {
            loadError = error.message;
        } else {
            loadError = "Couldn't load users.";
        }
    }

    // --------------------------------------------------
    // UI
    // --------------------------------------------------

    return (
        <div className="flex flex-col gap-xl">
            {/* Header */}

            <div className="flex flex-col gap-base sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-h4 font-semibold">Users</h1>

                    <p className="text-body text-muted">
                        Manage admin, manager and salesman accounts.
                    </p>
                </div>

                <Link href="/dashboard/users/new">
                    <Button>
                        <Plus className="size-4" />
                        Add User
                    </Button>
                </Link>
            </div>

            <FormError message={error ?? null} />

            {loadError && <FormError message={loadError} />}

            {!loadError && (
                <div className="overflow-x-auto rounded-lg border border-border bg-surface">
                    <table className="w-full text-left">
                        <thead className="border-b border-divider text-small text-muted">
                        <tr>
                            <th className="px-lg py-sm">Name</th>
                            <th className="px-lg py-sm">Email</th>
                            <th className="px-lg py-sm">Role</th>
                            <th className="px-lg py-sm">Status</th>
                            <th className="px-lg py-sm text-right">Action</th>
                        </tr>
                        </thead>

                        <tbody>
                        {users.map((user) => (
                            <tr
                                key={user.id}
                                className="border-b border-divider last:border-0"
                            >
                                <td className="px-lg py-base font-medium">{user.name}</td>

                                <td className="px-lg py-base text-muted">
                                    {user.email}
                                </td>

                                <td className="px-lg py-base capitalize text-muted">
                                    {user.role}
                                </td>

                                <td className="px-lg py-base">
                    <span
                        className={cn(
                            "rounded-full px-sm py-xs text-caption font-medium",
                            user.is_active
                                ? "bg-success/10 text-success"
                                : "bg-danger/10 text-danger"
                        )}
                    >
                      {user.is_active ? "Active" : "Inactive"}
                    </span>
                                </td>

                                <td className="px-lg py-base">
                                    <div className="flex justify-end gap-sm">
                                        <Link
                                            href={`/dashboard/users/${user.id}/edit`}
                                            className="rounded-md px-sm py-xs text-small font-medium text-primary hover:bg-surface-secondary"
                                        >
                                            Edit
                                        </Link>

                                        <form
                                            action={toggleUserStatusAction.bind(
                                                null,
                                                user.id,
                                                !user.is_active
                                            )}
                                        >
                                            <button
                                                type="submit"
                                                disabled={user.id === me.id}
                                                className="rounded-md px-sm py-xs text-small hover:bg-surface-secondary disabled:opacity-50"
                                            >
                                                {user.is_active ? "Deactivate" : "Activate"}
                                            </button>
                                        </form>

                                        <DeleteUserButton
                                            userId={user.id}
                                            disabled={user.id === me.id}
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {users.length === 0 && (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="py-xl text-center text-muted"
                                >
                                    No users found.
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