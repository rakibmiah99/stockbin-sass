import { apiFetch } from './client'
import type { Customer } from '@/types/Customer'

export const customersApi = {
  list() {
    return apiFetch<Customer[]>('/api/customers')
  },

  create(payload: { customer_name: string; customer_phone: string }) {
    return apiFetch<Customer>('/api/customers', { method: 'POST', body: payload })
  },

  update(id: number, payload: { customer_name: string; customer_phone: string }) {
    return apiFetch<Customer>(`/api/customers/${id}`, { method: 'PUT', body: payload })
  },

  remove(id: number) {
    return apiFetch<null>(`/api/customers/${id}`, { method: 'DELETE' })
  },
}
