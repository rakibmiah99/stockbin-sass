import { apiFetch } from './client'
import type { AuthSession } from '@/types/Auth'

export const authApi = {
  register(payload: { name: string; email: string; password: string; password_confirmation: string }) {
    return apiFetch<AuthSession>('/api/auth/register', { method: 'POST', body: payload })
  },

  login(payload: { email: string; password: string }) {
    return apiFetch<AuthSession>('/api/auth/login', { method: 'POST', body: payload })
  },

  forgotPassword(payload: { email: string }) {
    return apiFetch<null>('/api/auth/forgot-password', { method: 'POST', body: payload })
  },

  verifyOtp(payload: { email: string; otp: string }) {
    return apiFetch<null>('/api/auth/verify-otp', { method: 'POST', body: payload })
  },

  resetPassword(payload: { email: string; otp: string; password: string; password_confirmation: string }) {
    return apiFetch<null>('/api/auth/reset-password', { method: 'POST', body: payload })
  },

  logout() {
    return apiFetch<null>('/api/auth/logout', { method: 'POST', body: {} })
  },
}
