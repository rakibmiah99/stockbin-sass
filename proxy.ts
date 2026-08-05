import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { TOKEN_COOKIE } from '@/lib/auth/constants'

const PUBLIC_ROUTES = ['/login', '/register', '/forgot-password']

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hasToken = Boolean(request.cookies.get(TOKEN_COOKIE)?.value)
  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.startsWith(route))

  if (pathname === '/') {
    return NextResponse.redirect(new URL(hasToken ? '/dashboard' : '/login', request.url))
  }

  if (!hasToken && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (hasToken && isPublicRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
