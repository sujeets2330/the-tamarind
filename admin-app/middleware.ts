import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Protected routes that require authentication
const protectedRoutes = ['/dashboard', '/dashboard/:path*', '/api/admin/:path*']
const publicRoutes = ['/login', '/api/login']

export function middleware(request: NextRequest) {
  const session = request.cookies.get('admin_session')?.value
  const path = request.nextUrl.pathname

  // Check if path is protected
  const isProtected = protectedRoutes.some(route => {
    if (route.includes(':path*')) {
      const base = route.replace('/:path*', '')
      return path.startsWith(base)
    }
    return path === route
  })

  const isPublic = publicRoutes.some(route => path === route)

  // Allow API routes to handle their own auth
  if (path.startsWith('/api/') && !path.startsWith('/api/admin/')) {
    return NextResponse.next()
  }

  // Redirect root
  if (path === '/') {
    return NextResponse.redirect(new URL(session ? '/dashboard' : '/login', request.url))
  }

  // Protect dashboard routes
  if (isProtected && !session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If logged in and on login page, redirect to dashboard
  if (path === '/login' && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Add security headers
  const response = NextResponse.next()
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')
  
  return response
}

export const config = {
  matcher: ['/', '/login', '/dashboard/:path*', '/api/:path*'],
}