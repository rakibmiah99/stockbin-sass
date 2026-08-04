import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { authApi } from "@/lib/api/auth";
import { usersApi } from "@/lib/api/users";
import { ApiError, UnauthenticatedError } from "@/lib/api/client";
import { getAuthToken } from "@/lib/auth/cookies";
import { updateUserAction } from "@/lib/actions/users";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Select } from "@/components/ui/Select";
import { FormField } from "@/components/ui/FormField";
import { FormError } from "@/components/ui/FormError";

export const metadata: Metadata = {
  title: "Edit User",
};

export default async function EditUserPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const userId = Number(id);
  if (!Number.isFinite(userId)) notFound();

  const token = await getAuthToken();
  if (!token) redirect("/login");

  const me = await authApi.me(token).catch((err) => {
    if (err instanceof UnauthenticatedError) return null;
    throw err;
  });
  if (!me) redirect("/login");
  if (me.role !== "admin") redirect("/dashboard");

  const user = await usersApi.get(token, userId).catch((err) => {
    if (err instanceof ApiError) return null;
    throw err;
  });
  if (!user) notFound();

  const updateUserWithId = updateUserAction.bind(null, userId);

  return (
    <div className="mx-auto flex w-full flex-col gap-xl">
      <div className="flex flex-col gap-xs">
        <h1 className="text-h4 font-semibold text-foreground">Edit user</h1>
        <p className="text-body text-muted">Update {user.name}&apos;s account details.</p>
      </div>

      <form
        action={updateUserWithId}
        className="flex flex-col gap-lg rounded-lg border border-border bg-surface p-lg"
      >
        <FormError message={error ?? null} />

        <FormField id="name" label="Name">
          <Input id="name" name="name" required defaultValue={user.name} />
        </FormField>

        <FormField id="email" label="Email">
          <Input id="email" name="email" type="email" required defaultValue={user.email} />
        </FormField>

        <FormField id="role" label="Role">
          <Select id="role" name="role" defaultValue={user.role}>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="salesman">Salesman</option>
          </Select>
        </FormField>

        <FormField id="password" label="New password (optional)">
          <PasswordInput
            id="password"
            name="password"
            autoComplete="new-password"
            placeholder="Leave blank to keep current password"
          />
        </FormField>

        <FormField id="password_confirmation" label="Confirm new password">
          <PasswordInput
            id="password_confirmation"
            name="password_confirmation"
            autoComplete="new-password"
            placeholder="Re-enter new password"
          />
        </FormField>

        <div className="flex items-center gap-base">
          <Button type="submit">Save changes</Button>
          <Link href="/dashboard/users" className="text-small font-medium text-muted hover:text-foreground">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
