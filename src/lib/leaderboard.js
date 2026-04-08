import { supabase } from '@/lib/supabase'

export async function fetchLeaderboardWithRanks() {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, diamonds, avatar')
    .eq('role', 'user')
    .order('diamonds', { ascending: false })
    .order('id', { ascending: true })

  if (error || !data) return []

  return data.map((u, i) => ({
    ...u,
    name: [u.first_name, u.last_name].filter(Boolean).join(' ') || 'Anonim',
    rank: i + 1,
  }))
}

export async function fetchCurrentUserRank() {
  const { data: auth } = await supabase.auth.getUser()
  const user = auth?.user
  if (!user) return null

  const rankedUsers = await fetchLeaderboardWithRanks()
  const me = rankedUsers.find((u) => u.id === user.id)
  return me?.rank ?? null
}
