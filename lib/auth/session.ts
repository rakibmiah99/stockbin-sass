import 'server-only'
import { cache } from 'react'
import { redirect } from 'next/navigation'
import { userApi } from '@/lib/api/user'
import { getToken, clearToken } from './cookies'

export const getCurrentUser = cache(async () => {
  const token = await getToken()
  if (!token) {
    redirect('/login')
  }

  const response = await userApi.me()
  if (!response.success) {
    await clearToken()
    redirect('/login')
  }

  return response.data
})
