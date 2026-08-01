import type { DashboardExpense } from "@/lib/api/dashboard";
import { formatMoney, formatDate } from "@/lib/format";

export function RecentExpensesList({
  items,
  currencySymbol,
}: {
  items: DashboardExpense[];
  currencySymbol: string;
}) {
  if (items.length === 0) {
    return <p className="px-lg py-xl text-center text-small text-muted">No expenses recorded.</p>;
  }

  return (
    <ul className="divide-y divide-divider">
      {items.map((expense) => (
        <li key={expense.id} className="flex items-center justify-between gap-base px-lg py-base">
          <div>
            <p className="text-body font-medium text-foreground">{expense.title}</p>
            <p className="text-small text-muted">
              {expense.category} · {formatDate(expense.expense_date)}
            </p>
          </div>
          <span className="text-body font-medium text-foreground">
            {formatMoney(expense.amount, currencySymbol)}
          </span>
        </li>
      ))}
    </ul>
  );
}
