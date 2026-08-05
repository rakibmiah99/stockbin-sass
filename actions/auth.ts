'use server'

import { redirect } from 'next/navigation'
import { authApi } from '@/lib/api/auth'
import { setToken, clearToken } from '@/lib/auth/cookies'

export type AuthActionState = { error?: string } | undefined

export async function loginAction(_prevState: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const email = String(formData.get('email') ?? '')
  const password = String(formData.get('password') ?? '')

  const response = await authApi.login({ email, password })
  if (!response.success) {
    return { error: response.errors }
  }

  await setToken(response.data.token)
  redirect('/dashboard')
}

export async function registerAction(_prevState: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const name = String(formData.get('name') ?? '')
  const email = String(formData.get('email') ?? '')
  const password = String(formData.get('password') ?? '')
  const password_confirmation = String(formData.get('password_confirmation') ?? '')

  const response = await authApi.register({ name, email, password, password_confirmation })
  if (!response.success) {
    return { error: response.errors }
  }

  await setToken(response.data.token)
  redirect('/dashboard')
}

export type OtpFlowState = { error?: string; success?: boolean } | undefined

export async function forgotPasswordAction(_prevState: OtpFlowState, formData: FormData): Promise<OtpFlowState> {
  const email = String(formData.get('email') ?? '')

  const response = await authApi.forgotPassword({ email })
  if (!response.success) {
    return { error: response.errors }
  }

  return { success: true }
}

export async function verifyOtpAction(_prevState: OtpFlowState, formData: FormData): Promise<OtpFlowState> {
  const email = String(formData.get('email') ?? '')
  const otp = String(formData.get('otp') ?? '')

  const response = await authApi.verifyOtp({ email, otp })
  if (!response.success) {
    return { error: response.errors }
  }

  return { success: true }
}

export async function resetPasswordAction(_prevState: OtpFlowState, formData: FormData): Promise<OtpFlowState> {
  const email = String(formData.get('email') ?? '')
  const otp = String(formData.get('otp') ?? '')
  const password = String(formData.get('password') ?? '')
  const password_confirmation = String(formData.get('password_confirmation') ?? '')

  const response = await authApi.resetPassword({ email, otp, password, password_confirmation })
  if (!response.success) {
    return { error: response.errors }
  }

  redirect('/login')
}

export async function logoutAction() {
  try {
    await authApi.logout()
  } catch {
    // Best-effort — the token may already be invalid. Clear the cookie regardless.
  }
  await clearToken()
  redirect('/login')
}
