import type { DueCustomer } from "@/lib/api/dashboard";
import { formatMoney } from "@/lib/format";

export function DueCustomersList({
  items,
  currencySymbol,
}: {
  items: DueCustomer[];
  currencySymbol: string;
}) {
  if (items.length === 0) {
    return <p className="px-lg py-xl text-center text-small text-muted">No customers with dues.</p>;
  }

  return (
    <ul className="divide-y divide-divider">
      {items.map((customer) => (
        <li key={customer.id} className="flex items-center justify-between gap-base px-lg py-base">
          <div>
            <p className="text-body font-medium text-foreground">{customer.customer_name}</p>
            <p className="text-small text-muted">{customer.customer_phone}</p>
          </div>
          <span className="text-body font-medium text-warning-foreground">
            {formatMoney(customer.total_due, currencySymbol)}
          </span>
        </li>
      ))}
    </ul>
  );
}
