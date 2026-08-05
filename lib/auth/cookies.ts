import 'server-only'
import { cookies } from 'next/headers'
import { TOKEN_COOKIE, TOKEN_COOKIE_MAX_AGE } from './constants'

export async function getToken() {
  const cookieStore = await cookies()
  return cookieStore.get(TOKEN_COOKIE)?.value
}

export async function setToken(token: string) {
  const cookieStore = await cookies()
  cookieStore.set(TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: TOKEN_COOKIE_MAX_AGE,
  })
}

export async function clearToken() {
  const cookieStore = await cookies()
  cookieStore.delete(TOKEN_COOKIE)
}
