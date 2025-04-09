import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Skip middleware for service worker
  if (request.nextUrl.pathname === '/firebase-messaging-sw.js') {
    return NextResponse.next()
  }

  const token = request.cookies.get('token')
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth')

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (!isAuthPage && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}