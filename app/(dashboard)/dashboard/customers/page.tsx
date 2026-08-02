import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { customersApi, type CustomerPeriod } from "@/lib/api/customers";
import { shopSettingsApi } from "@/lib/api/shopSettings";
import { ApiError } from "@/lib/api/client";
import { getAuthToken } from "@/lib/auth/cookies";
import { formatMoney } from "@/lib/format";
import { DeleteCustomerButton } from "@/components/customers/DeleteCustomerButton";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { FormField } from "@/components/ui/FormField";
import { FormError } from "@/components/ui/FormError";

export const metadata: Metadata = {
  title: "Customers",
};

const PERIODS: { value: CustomerPeriod; label: string }[] = [
  { value: "last_100_records", label: "Latest 100" },
  { value: "last_30_days", label: "30 days" },
  { value: "last_60_days", label: "60 days" },
  { value: "last_90_days", label: "90 days" },
  { value: "custom", label: "Custom range" },
];

function parsePeriod(value: string | undefined): CustomerPeriod {
  return PERIODS.some((p) => p.value === value) ? (value as CustomerPeriod) : "last_100_records";
}

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{
    period?: string;
    from_date?: string;
    to_date?: string;
    search?: string;
    due?: string;
    error?: string;
  }>;
}) {
  const sp = await searchParams;

  const token = await getAuthToken();
  if (!token) redirect("/login");

  const period = parsePeriod(sp.period);
  const search = sp.search?.trim() || undefined;
  const dueOnly = sp.due === "1";

  let customers: Awaited<ReturnType<typeof customersApi.list>> = [];
  let currencySymbol = "৳";
  let loadError: string | null = null;

  try {
    const [customerList, shopSettings] = await Promise.all([
      dueOnly
        ? customersApi.listDue(token)
        : customersApi.list(token, { period, from_date: sp.from_date, to_date: sp.to_date, search }),
      shopSettingsApi.get(token).catch(() => null),
    ]);
    customers = customerList;
    currencySymbol = shopSettings?.currency_symbol ?? "৳";
  } catch (err) {
    loadError = err instanceof ApiError ? err.message : "Couldn't load customers.";
  }

  return (
    <div className="flex flex-col gap-xl">
      <div className="flex flex-col gap-base sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-h4 font-semibold text-foreground">Customers</h1>
          <p className="text-body text-muted">Manage customers and track outstanding dues.</p>
        </div>
        <Link href="/dashboard/customers/new">
          <Button>
            <Plus className="size-4" />
            Add customer
          </Button>
        </Link>
      </div>

      <FormError message={sp.error ?? null} />

      <div className="flex flex-col gap-base rounded-lg border border-border bg-surface p-lg">
        <div className="flex items-center gap-sm">
          <Link
            href="/dashboard/customers"
            className={`rounded-md px-base py-xs text-small font-medium transition-colors duration-[var(--motion-duration-fast)] ${
              !dueOnly ? "bg-primary text-primary-foreground" : "text-muted hover:bg-surface-secondary hover:text-foreground"
            }`}
          >
            All customers
          </Link>
          <Link
            href="/dashboard/customers?due=1"
            className={`rounded-md px-base py-xs text-small font-medium transition-colors duration-[var(--motion-duration-fast)] ${
              dueOnly ? "bg-primary text-primary-foreground" : "text-muted hover:bg-surface-secondary hover:text-foreground"
            }`}
          >
            Due only
          </Link>
        </div>

        {!dueOnly && (
          <form
            method="get"
            className="flex flex-col gap-base sm:flex-row sm:flex-wrap sm:items-end"
          >
            <div className="min-w-[10rem] flex-1">
              <FormField id="search" label="Search">
                <Input id="search" name="search" defaultValue={sp.search ?? ""} placeholder="Name or phone" />
              </FormField>
            </div>

            <div className="min-w-[10rem]">
              <FormField id="period" label="Period">
                <Select id="period" name="period" defaultValue={period}>
                  {PERIODS.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </Select>
              </FormField>
            </div>

            <div className="min-w-[8rem]">
              <FormField id="from_date" label="From">
                <Input id="from_date" name="from_date" type="date" defaultValue={sp.from_date ?? ""} />
              </FormField>
            </div>

            <div className="min-w-[8rem]">
              <FormField id="to_date" label="To">
                <Input id="to_date" name="to_date" type="date" defaultValue={sp.to_date ?? ""} />
              </FormField>
            </div>

            <Button type="submit" variant="outline">
              Filter
            </Button>
          </form>
        )}
      </div>

      {loadError ? (
        <FormError message={loadError} />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border bg-surface">
          <table className="w-full text-left text-body">
            <thead className="border-b border-divider text-small text-muted">
              <tr>
                <th className="px-lg py-sm font-medium">Name</th>
                <th className="px-lg py-sm font-medium">Phone</th>
                <th className="px-lg py-sm font-medium">Total sale</th>
                <th className="px-lg py-sm font-medium">Total paid</th>
                <th className="px-lg py-sm font-medium">Due</th>
                <th className="px-lg py-sm text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} className="border-b border-divider last:border-0">
                  <td className="px-lg py-base font-medium text-foreground">{customer.customer_name}</td>
                  <td className="px-lg py-base text-muted">{customer.customer_phone}</td>
                  <td className="px-lg py-base text-muted">{formatMoney(customer.total_sale, currencySymbol)}</td>
                  <td className="px-lg py-base text-muted">{formatMoney(customer.total_paid, currencySymbol)}</td>
                  <td className="px-lg py-base font-medium text-foreground">
                    {formatMoney(customer.total_due, currencySymbol)}
                  </td>
                  <td className="px-lg py-base">
                    <div className="flex items-center justify-end gap-sm">
                      <Link
                        href={`/dashboard/customers/${customer.id}/payments`}
                        className="rounded-md px-sm py-xs text-small font-medium text-primary hover:bg-surface-secondary"
                      >
                        Payments
                      </Link>
                      <Link
                        href={{
                          pathname: `/dashboard/customers/${customer.id}/edit`,
                          query: {
                            name: customer.customer_name,
                            phone: customer.customer_phone,
                          },
                        }}
                        className="rounded-md px-sm py-xs text-small font-medium text-primary hover:bg-surface-secondary"
                      >
                        Edit
                      </Link>
                      <DeleteCustomerButton customerId={customer.id} />
                    </div>
                  </td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-lg py-xl text-center text-muted">
                    No customers found.
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
