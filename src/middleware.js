import { createServerClient } from "@supabase/ssr"
import { NextResponse } from "next/server"

export async function middleware(request) {
  const debugRunId = `pre-fix-${Date.now()}`
  const debugLog = (hypothesisId, location, message, data = {}) => {
    // #region agent log
    fetch('http://127.0.0.1:7716/ingest/ab73368d-4b9a-46fa-b373-58db86b80870',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'06c2ea'},body:JSON.stringify({sessionId:'06c2ea',runId:debugRunId,hypothesisId,location,message,data,timestamp:Date.now()})}).catch(()=>{})
    console.error('[agent-debug]', JSON.stringify({sessionId:'06c2ea',runId:debugRunId,hypothesisId,location,message,data,timestamp:Date.now()}))
    // #endregion
  }

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
  debugLog(
    'H1_ROUTE_CLASSIFICATION',
    'src/middleware.js:34',
    'Route classification and cookie precheck',
    { pathname, isProtectedRoute, isAuthPage, hasAuthCookie, cookieCount: allCookies.length }
  )

  // If it's not a protected route and not an auth page, skip auth check entirely
  if (!isProtectedRoute && !isAuthPage) {
    return response
  }

  // If it's a protected route but no auth cookie is present, redirect to /auth immediately
  if (isProtectedRoute && !hasAuthCookie) {
    debugLog(
      'H2_EARLY_REDIRECT',
      'src/middleware.js:46',
      'Protected route without auth cookie, redirecting early',
      { pathname }
    )
    const url = request.nextUrl.clone()
    url.pathname = '/auth'
    return NextResponse.redirect(url)
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    debugLog(
      'H3_SUPABASE_CONFIG',
      'src/middleware.js:65',
      'Supabase env presence in middleware',
      { hasSupabaseUrl: Boolean(supabaseUrl), hasSupabaseKey: Boolean(supabaseKey) }
    )
    if (!supabaseUrl || !supabaseKey) {
      debugLog(
        'H3_SUPABASE_CONFIG',
        'src/middleware.js:72',
        'Missing Supabase env in middleware, using safe fallback',
        { pathname, isProtectedRoute, isAuthPage }
      )
      if (isProtectedRoute) {
        const url = request.nextUrl.clone()
        url.pathname = '/auth'
        return NextResponse.redirect(url)
      }
      return response
    }
    const supabase = createServerClient(
      supabaseUrl,
      supabaseKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            debugLog(
              'H4_COOKIE_SETALL',
              'src/middleware.js:79',
              'Supabase requested cookie updates',
              { cookiesToSetCount: cookiesToSet.length, names: cookiesToSet.map(c => c.name) }
            )
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
    debugLog(
      'H5_SESSION_RESULT',
      'src/middleware.js:103',
      'Session resolution result',
      { hasSession: Boolean(session), hasUser: Boolean(user), pathname, isProtectedRoute, isAuthPage }
    )

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
  } catch (error) {
    debugLog(
      'H6_MIDDLEWARE_THROW',
      'src/middleware.js:121',
      'Middleware threw error',
      { pathname, errorName: error?.name, errorMessage: error?.message }
    )
    throw error
  }

  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|assets).*)',
  ],
}
