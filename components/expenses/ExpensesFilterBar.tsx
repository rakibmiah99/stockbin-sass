'use client'

import { useRouter, usePathname } from 'next/navigation'
import type { ExpenseCategory, ExpenseUiPeriod } from '@/types/Expense'

export type ExpenseFilters = {
  period: ExpenseUiPeriod
  from_date: string
  to_date: string
  expense_category_id: string
}

const PERIOD_OPTIONS: { value: ExpenseUiPeriod; label: string }[] = [
  { value: 'last_100_records', label: 'Last 100 records' },
  { value: 'last_30_days', label: 'Last 30 days' },
  { value: 'last_60_days', label: 'Last 60 days' },
  { value: 'this_month', label: 'This month' },
  { value: 'last_90_days', label: 'Last 90 days' },
  { value: 'custom', label: 'Custom range' },
]

const selectClass = 'text-sm px-3 py-2 rounded-xl border border-border bg-card text-foreground outline-none focus:ring-2 focus:ring-ring'

export function ExpensesFilterBar({ filters, categories }: { filters: ExpenseFilters; categories: ExpenseCategory[] }) {
  const router = useRouter()
  const pathname = usePathname()

  function updateParams(next: Partial<ExpenseFilters>) {
    const merged = { ...filters, ...next }
    const query = new URLSearchParams()
    if (merged.period !== 'last_100_records') query.set('period', merged.period)
    if (merged.period === 'custom') {
      if (merged.from_date) query.set('from_date', merged.from_date)
      if (merged.to_date) query.set('to_date', merged.to_date)
    }
    if (merged.expense_category_id) query.set('expense_category_id', merged.expense_category_id)

    const qs = query.toString()
    router.push(`${pathname}${qs ? `?${qs}` : ''}`)
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        value={filters.period}
        onChange={e => updateParams({ period: e.target.value as ExpenseUiPeriod, from_date: '', to_date: '' })}
        className={selectClass}
      >
        {PERIOD_OPTIONS.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>

      <select
        value={filters.expense_category_id}
        onChange={e => updateParams({ expense_category_id: e.target.value })}
        className={selectClass}
      >
        <option value="">All categories</option>
        {categories.map(c => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      {filters.period === 'custom' && (
        <>
          <input
            type="date" value={filters.from_date} onChange={e => updateParams({ from_date: e.target.value })}
            className={selectClass}
          />
          <span className="text-muted-foreground text-sm">to</span>
          <input
            type="date" value={filters.to_date} onChange={e => updateParams({ to_date: e.target.value })}
            className={selectClass}
          />
        </>
      )}
    </div>
  )
}
