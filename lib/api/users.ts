import { apiFetch } from './client'
import type { ManagedUser } from '@/types/User'
import type { Role } from '@/types/Auth'

export const usersApi = {
  list() {
    return apiFetch<ManagedUser[]>('/api/users')
  },

  create(payload: { name: string; email: string; password: string; password_confirmation: string; role: Role }) {
    return apiFetch<ManagedUser>('/api/users', { method: 'POST', body: payload })
  },

  update(id: number, payload: Record<string, unknown>) {
    return apiFetch<ManagedUser>(`/api/users/${id}`, { method: 'PUT', body: payload })
  },

  updateStatus(id: number, isActive: boolean) {
    return apiFetch<ManagedUser>(`/api/users/${id}/status`, { method: 'PATCH', body: { is_active: isActive } })
  },

  remove(id: number) {
    return apiFetch<null>(`/api/users/${id}`, { method: 'DELETE' })
  },
}
