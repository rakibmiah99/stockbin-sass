import { apiFetch } from './client'
import type { AuthenticatedUser } from '@/types/Auth'

export const userApi = {
  me() {
    return apiFetch<AuthenticatedUser>('/api/user')
  },
}
