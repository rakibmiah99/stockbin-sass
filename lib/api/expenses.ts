import { apiFetch } from './client'
import type { Expense, ExpensePeriod } from '@/types/Expense'

type ExpenseListParams = {
  period?: ExpensePeriod
  from_date?: string
  to_date?: string
  expense_category_id?: string | number
}

export const expensesApi = {
  list(params: ExpenseListParams = {}) {
    const query = new URLSearchParams()
    if (params.period) query.set('period', params.period)
    if (params.from_date) query.set('from_date', params.from_date)
    if (params.to_date) query.set('to_date', params.to_date)
    if (params.expense_category_id) query.set('expense_category_id', String(params.expense_category_id))

    const qs = query.toString()
    return apiFetch<Expense[]>(`/api/expenses${qs ? `?${qs}` : ''}`)
  },

  create(payload: { expense_category_id: number; title: string; amount: number; expense_date: string; note?: string }) {
    return apiFetch<Expense>('/api/expenses', { method: 'POST', body: payload })
  },

  update(id: number, payload: { expense_category_id: number; title: string; amount: number; expense_date: string; note?: string }) {
    return apiFetch<Expense>(`/api/expenses/${id}`, { method: 'PUT', body: payload })
  },

  remove(id: number) {
    return apiFetch<null>(`/api/expenses/${id}`, { method: 'DELETE' })
  },
}
