import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { customersApi, type CustomerPeriod } from "@/lib/api/customers";
import { shopSettingsApi } from "@/lib/api/shopSettings";
import { ApiError } from "@/lib/api/client";
import { getAuthToken } from "@/lib/auth/cookies";
import { formatMoney, formatDate } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { FormField } from "@/components/ui/FormField";
import { FormError } from "@/components/ui/FormError";

export const metadata: Metadata = {
  title: "Customer Payments",
};

const PERIODS: { value: CustomerPeriod; label: string }[] = [
  { value: "last_100_records", label: "Latest 100" },
  { value: "last_30_days", label: "30 days" },
  { value: "last_60_days", label: "60 days" },
  { value: "last_90_days", label: "90 days" },
];

function parsePeriod(value: string | undefined): CustomerPeriod {
  return PERIODS.some((p) => p.value === value) ? (value as CustomerPeriod) : "last_100_records";
}

export default async function CustomerPaymentsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ period?: string; error?: string }>;
}) {
  const { id } = await params;
  const customerId = Number(id);
  if (!Number.isFinite(customerId)) notFound();

  const sp = await searchParams;
  const period = parsePeriod(sp.period);

  const token = await getAuthToken();
  if (!token) redirect("/login");

  let payments: Awaited<ReturnType<typeof customersApi.payments>> = [];
  let currencySymbol = "৳";
  let loadError: string | null = null;

  try {
    const [paymentList, shopSettings] = await Promise.all([
      customersApi.payments(token, customerId, { period }),
      shopSettingsApi.get(token).catch(() => null),
    ]);
    payments = paymentList;
    currencySymbol = shopSettings?.currency_symbol ?? "৳";
  } catch (err) {
    loadError = err instanceof ApiError ? err.message : "Couldn't load payments.";
  }

  const customerName = payments[0]?.customer.customer_name;

  return (
    <div className="flex flex-col gap-xl">
      <div className="flex flex-col gap-base sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-h4 font-semibold text-foreground">
            {customerName ? `${customerName}'s payments` : "Customer payments"}
          </h1>
          <p className="text-body text-muted">Payment history recorded against this customer&apos;s invoices.</p>
        </div>
        <Link href="/dashboard/customers" className="text-small font-medium text-primary hover:opacity-80">
          Back to customers
        </Link>
      </div>

      <FormError message={sp.error ?? null} />

      <form method="get" className="flex items-end gap-base rounded-lg border border-border bg-surface p-lg">
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
        <Button type="submit" variant="outline">
          Filter
        </Button>
      </form>

      {loadError ? (
        <FormError message={loadError} />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border bg-surface">
          <table className="w-full text-left text-body">
            <thead className="border-b border-divider text-small text-muted">
              <tr>
                <th className="px-lg py-sm font-medium">Date</th>
                <th className="px-lg py-sm font-medium">Invoice</th>
                <th className="px-lg py-sm font-medium">Amount</th>
                <th className="px-lg py-sm font-medium">Method</th>
                <th className="px-lg py-sm font-medium">Note</th>
                <th className="px-lg py-sm font-medium">Recorded by</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id} className="border-b border-divider last:border-0">
                  <td className="px-lg py-base text-muted">{formatDate(payment.payment_date)}</td>
                  <td className="px-lg py-base font-medium text-foreground">{payment.sale_invoice.invoice_no}</td>
                  <td className="px-lg py-base text-foreground">{formatMoney(payment.amount, currencySymbol)}</td>
                  <td className="px-lg py-base capitalize text-muted">{payment.payment_method}</td>
                  <td className="px-lg py-base text-muted">{payment.note ?? "—"}</td>
                  <td className="px-lg py-base text-muted">{payment.created_by ?? "—"}</td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-lg py-xl text-center text-muted">
                    No payments recorded for this customer yet.
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
