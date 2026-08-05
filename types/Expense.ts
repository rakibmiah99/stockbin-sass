export type ExpenseCategory = {
  id: number
  tenant_id: number
  name: string
  description: string | null
  is_active: boolean
  sort_order: number
}

export type ExpensePeriod = 'last_100_records' | 'last_30_days' | 'last_60_days' | 'last_90_days' | 'custom'

// UI-only preset — "this_month" isn't a period the API knows about, it resolves
// to period=custom with computed from/to dates before the request goes out.
export type ExpenseUiPeriod = ExpensePeriod | 'this_month'

export type Expense = {
  id: number
  tenant_id: number
  expense_category_id: number
  title: string
  amount: string
  expense_date: string
  note: string | null
  category: string
  expense_category: ExpenseCategory
}
