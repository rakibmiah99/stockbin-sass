import { apiFetch } from './client'
import type { ExpenseCategory } from '@/types/Expense'

export const expenseCategoriesApi = {
  list() {
    return apiFetch<ExpenseCategory[]>('/api/expense-categories')
  },

  create(payload: { name: string; description?: string; is_active?: boolean }) {
    return apiFetch<ExpenseCategory>('/api/expense-categories', { method: 'POST', body: payload })
  },

  update(id: number, payload: { name?: string; description?: string; is_active?: boolean }) {
    return apiFetch<ExpenseCategory>(`/api/expense-categories/${id}`, { method: 'PUT', body: payload })
  },

  remove(id: number) {
    return apiFetch<null>(`/api/expense-categories/${id}`, { method: 'DELETE' })
  },
}
