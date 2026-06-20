import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const role = request.cookies.get('hs_role')?.value
  const path = request.nextUrl.pathname

  if (path.startsWith('/admin') && role == null) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  if (
    (path.startsWith('/profile') ||
      path.startsWith('/favorites') ||
      path.startsWith('/inquiries') ||
      path.startsWith('/my-properties') ||
      path.startsWith('/change-password')) &&
    !role
  ) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/profile', '/favorites', '/inquiries', '/my-properties/:path*', '/change-password'],
}
