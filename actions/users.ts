'use server'

import { revalidatePath } from 'next/cache'
import { usersApi } from '@/lib/api/users'
import type { Role } from '@/types/Auth'

export type UserActionState = { error?: string } | undefined

export async function createUserAction(formData: FormData): Promise<UserActionState> {
  const name = String(formData.get('name') ?? '')
  const email = String(formData.get('email') ?? '')
  const password = String(formData.get('password') ?? '')
  const password_confirmation = String(formData.get('password_confirmation') ?? '')
  const role = String(formData.get('role') ?? 'salesman') as Role

  const response = await usersApi.create({ name, email, password, password_confirmation, role })
  if (!response.success) {
    return { error: response.errors }
  }

  revalidatePath('/users')
}

export async function updateUserAction(id: number, formData: FormData): Promise<UserActionState> {
  const password = String(formData.get('password') ?? '')

  const payload: Record<string, unknown> = {
    name: String(formData.get('name') ?? ''),
    email: String(formData.get('email') ?? ''),
    role: String(formData.get('role') ?? '') as Role,
  }
  if (password) {
    payload.password = password
    payload.password_confirmation = String(formData.get('password_confirmation') ?? '')
  }

  const response = await usersApi.update(id, payload)
  if (!response.success) {
    return { error: response.errors }
  }

  revalidatePath('/users')
}

export async function updateUserStatusAction(id: number, isActive: boolean): Promise<UserActionState> {
  const response = await usersApi.updateStatus(id, isActive)
  if (!response.success) {
    return { error: response.errors }
  }

  revalidatePath('/users')
}

export async function deleteUserAction(id: number): Promise<UserActionState> {
  const response = await usersApi.remove(id)
  if (!response.success) {
    return { error: response.errors }
  }

  revalidatePath('/users')
}
