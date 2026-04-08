'use client'

import { useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'

/** Returns today's date as YYYY-MM-DD string (local time) */
function todayStr() {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/**
 * GlobalSessionTracker
 * Drop this anywhere high in the tree (e.g. LayoutWrapper) and it will track
 * session time for the current authenticated user across all pages.
 * Every 30 s it flushes to Supabase: today_time_spent + time_spent + last_active_date
 */
export default function GlobalSessionTracker() {
    const userIdRef = useRef(null)
    const todaySecsRef = useRef(0)
    const totalSecsRef = useRef(0)
    const pendingRef = useRef(0)
    const flushIntervalRef = useRef(null)

    useEffect(() => {
        let tickInterval = null

        const init = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            userIdRef.current = user.id

            const { data: profile } = await supabase
                .from('profiles')
                .select('time_spent, today_time_spent, last_active_date')
                .eq('id', user.id)
                .single()

            if (profile) {
                const isToday = profile.last_active_date === todayStr()
                todaySecsRef.current = isToday ? (profile.today_time_spent || 0) : 0
                totalSecsRef.current = profile.time_spent || 0

                if (!isToday) {
                    await supabase
                        .from('profiles')
                        .update({ today_time_spent: 0, last_active_date: todayStr() })
                        .eq('id', user.id)
                }
            }

            // Tick every second
            tickInterval = setInterval(() => {
                pendingRef.current += 1
                todaySecsRef.current += 1
                totalSecsRef.current += 1
            }, 1000)

            // Flush every 30 seconds
            flushIntervalRef.current = setInterval(flush, 30_000)
        }

        const flush = async () => {
            if (!userIdRef.current || pendingRef.current === 0) return
            const toFlushToday = todaySecsRef.current
            const toFlushTotal = totalSecsRef.current
            pendingRef.current = 0
            await supabase
                .from('profiles')
                .update({
                    today_time_spent: toFlushToday,
                    time_spent: toFlushTotal,
                    last_active_date: todayStr()
                })
                .eq('id', userIdRef.current)
        }

        init()

        // Flush on page close/refresh
        const handleUnload = () => {
            if (!userIdRef.current || pendingRef.current === 0) return
            navigator.sendBeacon?.('/api/noop') // keep connection alive
            // Best-effort sync flush (runs only if beacon budget allows)
            supabase.from('profiles').update({
                today_time_spent: todaySecsRef.current,
                time_spent: totalSecsRef.current,
                last_active_date: todayStr()
            }).eq('id', userIdRef.current)
        }
        window.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') handleUnload()
        })

        return () => {
            clearInterval(tickInterval)
            clearInterval(flushIntervalRef.current)
            handleUnload()
        }
    }, [])

    return null // renders nothing
}
