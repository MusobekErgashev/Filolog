import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim()
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '').trim()

const hasValidConfig = supabaseUrl.startsWith('http') && Boolean(supabaseAnonKey)

if (!hasValidConfig) {
  console.error(
    'Supabase env vars are missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) in Vercel project settings.'
  )
}

const missingEnvError = new Error(
  'Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel, then redeploy.'
)

export const supabase = hasValidConfig
  ? createBrowserClient(supabaseUrl, supabaseAnonKey)
  : new Proxy(
      {},
      {
        get() {
          throw missingEnvError
        },
      }
    )