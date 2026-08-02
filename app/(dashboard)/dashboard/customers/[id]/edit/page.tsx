import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getAuthToken } from "@/lib/auth/cookies";
import { updateCustomerAction } from "@/lib/actions/customers";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FormField } from "@/components/ui/FormField";
import { FormError } from "@/components/ui/FormError";

export const metadata: Metadata = {
  title: "Edit Customer",
};

export default async function EditCustomerPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ name?: string; phone?: string; error?: string }>;
}) {
  const { id } = await params;
  const customerId = Number(id);
  if (!Number.isFinite(customerId)) notFound();

  const sp = await searchParams;
  // The API has no single-customer GET endpoint, so the customers list page
  // passes the current field values through the edit link's query string.
  if (!sp.name || !sp.phone) {
    redirect("/dashboard/customers");
  }

  const token = await getAuthToken();
  if (!token) redirect("/login");

  const updateCustomerWithId = updateCustomerAction.bind(null, customerId);

  return (
    <div className="mx-auto flex w-full flex-col gap-xl">
      <div className="flex flex-col gap-xs">
        <h1 className="text-h4 font-semibold text-foreground">Edit customer</h1>
        <p className="text-body text-muted">Update this customer&apos;s details.</p>
      </div>

      <form
        action={updateCustomerWithId}
        className="flex flex-col gap-lg rounded-lg border border-border bg-surface p-lg"
      >
        <FormError message={sp.error ?? null} />

        <FormField id="customer_name" label="Name">
          <Input id="customer_name" name="customer_name" required defaultValue={sp.name} />
        </FormField>

        <FormField id="customer_phone" label="Phone">
          <Input id="customer_phone" name="customer_phone" required defaultValue={sp.phone} />
        </FormField>

        <div className="flex items-center gap-base">
          <Button type="submit">Save changes</Button>
          <Link href="/dashboard/customers" className="text-small font-medium text-muted hover:text-foreground">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
