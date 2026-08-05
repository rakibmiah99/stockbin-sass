import { apiFetch } from './client'
import type { BusinessSettings } from '@/types/Auth'

export const settingsApi = {
  getBusinessSettings() {
    return apiFetch<BusinessSettings | null>('/api/business-settings')
  },

  createBusinessSettings(formData: FormData) {
    return apiFetch<BusinessSettings>('/api/business-settings', { method: 'POST', body: formData })
  },

  updateBusinessSettings(formData: FormData) {
    return apiFetch<BusinessSettings>('/api/business-settings/update', { method: 'POST', body: formData })
  },
}
