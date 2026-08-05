import { apiFetch } from './client'
import type { Product } from '@/types/Product'

export const productsApi = {
  list() {
    return apiFetch<Product[]>('/api/products')
  },

  create(formData: FormData) {
    return apiFetch<Product>('/api/products', { method: 'POST', body: formData })
  },

  update(id: number, formData: FormData) {
    return apiFetch<Product>(`/api/products/${id}/update`, { method: 'POST', body: formData })
  },

  remove(id: number) {
    return apiFetch<null>(`/api/products/${id}`, { method: 'DELETE' })
  },
}
