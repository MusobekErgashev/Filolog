import { createServerClient } from "@supabase/ssr"
import { NextResponse } from "next/server"

export async function middleware(request) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Fast path: check if we even have any Supabase auth cookies
  const allCookies = request.cookies.getAll()
  const hasAuthCookie = allCookies.some(c => c.name.includes('auth-token'))

  const { pathname } = request.nextUrl
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
  const isAuthPage = pathname === '/' || pathname === '/auth'

  // If it's not a protected route and not an auth page, skip auth check entirely
  if (!isProtectedRoute && !isAuthPage) {
    return response
  }

  // If it's a protected route but no auth cookie is present, redirect to /auth immediately
  if (isProtectedRoute && !hasAuthCookie) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth'
    return NextResponse.redirect(url)
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
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

  // Use getSession() for a faster check if possible, or only getUser() for protected routes
  // For redirection skip, getSession() is often enough and much faster as it checks JWT locally first
  const {
    data: { session },
  } = await supabase.auth.getSession()
  
  const user = session?.user

  // Redirect logic
  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth'
    return NextResponse.redirect(url)
  }

  if (user && isAuthPage) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|assets).*)',
  ],
}
