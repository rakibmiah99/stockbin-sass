import { NextResponse } from 'next/server'
import { clearToken } from '@/lib/auth/cookies'

export async function GET(request: Request) {
  await clearToken()
  return NextResponse.redirect(new URL('/login', request.url))
}
