import type { LowStockItem } from "@/lib/api/dashboard";
import { formatMoney } from "@/lib/format";

export function LowStockList({
  items,
  currencySymbol,
}: {
  items: LowStockItem[];
  currencySymbol: string;
}) {
  if (items.length === 0) {
    return <p className="px-lg py-xl text-center text-small text-muted">No low stock items.</p>;
  }

  return (
    <ul className="divide-y divide-divider">
      {items.map((item) => (
        <li key={item.product_id} className="flex items-center justify-between gap-base px-lg py-base">
          <div>
            <p className="text-body font-medium text-foreground">{item.product_name}</p>
            <p className="text-small text-muted">
              {item.product_code} · {item.remaining_qty} {item.unit} left
            </p>
          </div>
          <span className="rounded-full border border-danger bg-danger/10 px-sm py-xs text-caption font-medium text-danger">
            {formatMoney(item.price, currencySymbol)}
          </span>
        </li>
      ))}
    </ul>
  );
}
