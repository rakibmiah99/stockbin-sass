import { formatMoney } from '@/lib/format'
import { Button } from '@/components/ui/Button'
import type { DashboardExpense } from '@/types/Dashboard'

export function RecentExpensesList({ expenses, currencySymbol }: { expenses: DashboardExpense[]; currencySymbol: string }) {
  return (
    <div className="bg-card border border-border rounded-xl">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <h3 className="font-600 text-foreground text-sm">Recent expenses</h3>
        <Button variant="link">View all</Button>
      </div>
      {expenses.length === 0 ? (
        <p className="px-5 py-8 text-sm text-muted-foreground text-center">No expenses recorded.</p>
      ) : (
        <div className="divide-y divide-border">
          {expenses.map(expense => (
            <div key={expense.id} className="flex items-center gap-4 px-5 py-3 hover:bg-muted/50 transition-colors">
              <div className="flex-1 min-w-0">
                <div className="text-sm font-500 truncate">{expense.title}</div>
                <div className="text-xs text-muted-foreground">{expense.category} · {expense.expense_date}</div>
              </div>
              <div className="font-mono text-sm font-600">{formatMoney(expense.amount, currencySymbol)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
