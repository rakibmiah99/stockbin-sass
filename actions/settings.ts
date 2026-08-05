'use server'

import { revalidatePath } from 'next/cache'
import { settingsApi } from '@/lib/api/settings'

export type SettingsActionState = { error?: string; success?: boolean } | undefined

export async function saveBusinessSettingsAction(_prevState: SettingsActionState, formData: FormData): Promise<SettingsActionState> {
  const exists = formData.get('_exists') === '1'
  formData.delete('_exists')

  // An empty file input still submits a zero-byte File — drop it so an update
  // without a new logo doesn't fail Laravel's image validation.
  const logo = formData.get('business_logo')
  if (logo instanceof File && logo.size === 0) {
    formData.delete('business_logo')
  }

  const response = exists
    ? await settingsApi.updateBusinessSettings(formData)
    : await settingsApi.createBusinessSettings(formData)

  if (!response.success) {
    return { error: response.errors }
  }

  revalidatePath('/settings')
  return { success: true }
}
