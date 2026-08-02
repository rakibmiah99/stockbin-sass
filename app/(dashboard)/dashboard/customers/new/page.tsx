import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthToken } from "@/lib/auth/cookies";
import { createCustomerAction } from "@/lib/actions/customers";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FormField } from "@/components/ui/FormField";
import { FormError } from "@/components/ui/FormError";

export const metadata: Metadata = {
  title: "Add Customer",
};

export default async function NewCustomerPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  const token = await getAuthToken();
  if (!token) redirect("/login");

  return (
    <div className="mx-auto flex w-full flex-col gap-xl">
      <div className="flex flex-col gap-xs">
        <h1 className="text-h4 font-semibold text-foreground">Add customer</h1>
        <p className="text-body text-muted">Create a new customer record.</p>
      </div>

      <form
        action={createCustomerAction}
        className="flex flex-col gap-lg rounded-lg border border-border bg-surface p-lg"
      >
        <FormError message={error ?? null} />

        <FormField id="customer_name" label="Name">
          <Input id="customer_name" name="customer_name" required placeholder="Karim Ali" />
        </FormField>

        <FormField id="customer_phone" label="Phone">
          <Input id="customer_phone" name="customer_phone" required placeholder="01712345678" />
        </FormField>

        <div className="flex items-center gap-base">
          <Button type="submit">Save customer</Button>
          <Link href="/dashboard/customers" className="text-small font-medium text-muted hover:text-foreground">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
