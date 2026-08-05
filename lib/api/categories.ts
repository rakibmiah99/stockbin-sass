import { apiFetch } from './client'
import type { Category } from '@/types/Category'

export const categoriesApi = {
  list() {
    return apiFetch<Category[]>('/api/categories')
  },

  create(formData: FormData) {
    return apiFetch<Category>('/api/categories', { method: 'POST', body: formData })
  },

  update(id: number, formData: FormData) {
    return apiFetch<Category>(`/api/categories/${id}/update`, { method: 'POST', body: formData })
  },

  remove(id: number) {
    return apiFetch<null>(`/api/categories/${id}`, { method: 'DELETE' })
  },

  sort(order: number[]) {
    return apiFetch<Category[]>('/api/categories/sort', { method: 'PUT', body: { order } })
  },
}
