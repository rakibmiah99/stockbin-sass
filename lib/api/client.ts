import 'server-only'
import { cookies } from 'next/headers'
import type { ApiResponse } from '@/types/Api'
import { getToken } from '@/lib/auth/cookies'
import { TIMEZONE_COOKIE } from '@/lib/auth/constants'

const API_BASE_URL = process.env.API_BASE_URL

type ApiFetchInit = Omit<RequestInit, 'body'> & { body?: unknown }

export async function apiFetch<T>(path: string, init: ApiFetchInit = {}): Promise<ApiResponse<T>> {
  if (!API_BASE_URL) {
    throw new Error('API_BASE_URL is not configured.')
  }

  const [token, cookieStore] = await Promise.all([getToken(), cookies()])
  const timezone = cookieStore.get(TIMEZONE_COOKIE)?.value

  const isFormData = init.body instanceof FormData

  const headers = new Headers(init.headers)
  headers.set('Accept', 'application/json')
  if (init.body !== undefined && !isFormData) {
    // FormData sets its own multipart Content-Type (with boundary) — leave it to fetch.
    headers.set('Content-Type', 'application/json')
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }
  if (timezone) {
    headers.set('X-Timezone', timezone)
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
    body: init.body === undefined ? undefined : isFormData ? (init.body as FormData) : JSON.stringify(init.body),
    cache: 'no-store',
  })

  return response.json() as Promise<ApiResponse<T>>
}
