import { createServerClient } from "@supabase/ssr"
import { NextResponse } from "next/server"

export async function middleware(request) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Protected routes
  const protectedRoutes = [
    '/dashboard',
    '/profile',
    '/library',
    '/quiz',
    '/homework',
    '/liderboard',
    '/aiTutor',
    '/lessons',
    '/subscription'
  ]

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  // Redirect if not logged in and trying to access protected route
  if (!user && isProtectedRoute) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Redirect if logged in and trying to access landing or auth
  if (user && (pathname === '/' || pathname === '/auth')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|assets).*)',
  ],
}
