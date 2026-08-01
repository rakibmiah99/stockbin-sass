import type { DashboardInvoice } from "@/lib/api/dashboard";
import { formatMoney, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  paid: "bg-success-background text-success-foreground border-success-border",
  partial: "bg-warning/15 text-warning-foreground border-warning",
  due: "bg-danger/10 text-danger border-danger",
  unpaid: "bg-danger/10 text-danger border-danger",
};

export function RecentInvoicesList({
  items,
  currencySymbol,
}: {
  items: DashboardInvoice[];
  currencySymbol: string;
}) {
  if (items.length === 0) {
    return <p className="px-lg py-xl text-center text-small text-muted">No invoices yet.</p>;
  }

  return (
    <ul className="divide-y divide-divider">
      {items.map((invoice) => (
        <li key={invoice.id} className="flex items-center justify-between gap-base px-lg py-base">
          <div>
            <p className="text-body font-medium text-foreground">{invoice.invoice_no}</p>
            <p className="text-small text-muted">
              {invoice.customer_name} · {formatDate(invoice.invoice_date)}
            </p>
          </div>
          <div className="flex flex-col items-end gap-xs">
            <span className="text-body font-medium text-foreground">
              {formatMoney(invoice.grand_total, currencySymbol)}
            </span>
            <span
              className={cn(
                "rounded-full border px-sm py-xs text-caption font-medium capitalize",
                STATUS_STYLES[invoice.payment_status] ?? "border-border bg-surface-secondary text-muted"
              )}
            >
              {invoice.payment_status}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}
