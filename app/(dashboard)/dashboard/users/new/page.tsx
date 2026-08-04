import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { authApi } from "@/lib/api/auth";
import { UnauthenticatedError } from "@/lib/api/client";
import { getAuthToken } from "@/lib/auth/cookies";
import { createUserAction } from "@/lib/actions/users";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Select } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { FormField } from "@/components/ui/FormField";
import { FormError } from "@/components/ui/FormError";

export const metadata: Metadata = {
  title: "Add User",
};

export default async function NewUserPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  const token = await getAuthToken();
  if (!token) redirect("/login");

  const me = await authApi.me(token).catch((err) => {
    if (err instanceof UnauthenticatedError) return null;
    throw err;
  });
  if (!me) redirect("/login");
  if (me.role !== "admin") redirect("/dashboard");

  return (
    <div className="mx-auto flex w-full flex-col gap-xl">
      <div className="flex flex-col gap-xs">
        <h1 className="text-h4 font-semibold text-foreground">Add user</h1>
        <p className="text-body text-muted">Create an admin, manager, or salesman account for your team.</p>
      </div>

      <form
        action={createUserAction}
        className="flex flex-col gap-lg rounded-lg border border-border bg-surface p-lg"
      >
        <FormError message={error ?? null} />

        <FormField id="name" label="Name">
          <Input id="name" name="name" required placeholder="Jane Doe" />
        </FormField>

        <FormField id="email" label="Email">
          <Input id="email" name="email" type="email" required placeholder="jane@example.com" />
        </FormField>

        <FormField id="role" label="Role">
          <Select id="role" name="role" defaultValue="salesman">
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="salesman">Salesman</option>
          </Select>
        </FormField>

        <FormField id="password" label="Password">
          <PasswordInput
            id="password"
            name="password"
            required
            autoComplete="new-password"
            placeholder="At least 8 characters"
          />
        </FormField>

        <FormField id="password_confirmation" label="Confirm password">
          <PasswordInput
            id="password_confirmation"
            name="password_confirmation"
            required
            autoComplete="new-password"
            placeholder="Re-enter password"
          />
        </FormField>

        <Checkbox id="is_active" name="is_active" label="Active" defaultChecked />

        <div className="flex items-center gap-base">
          <Button type="submit">Create user</Button>
          <Link href="/dashboard/users" className="text-small font-medium text-muted hover:text-foreground">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
