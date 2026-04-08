'use client'

import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { useEffect, useRef, useState } from 'react'
import { fetchCurrentUserRank } from '@/lib/leaderboard'

/** Format seconds into "X soat Y daqiqa" or "Y daqiqa" */
function formatTime(totalSecs) {
    const mins = Math.floor(totalSecs / 60)
    const hours = Math.floor(mins / 60)
    const remainMins = mins % 60
    if (hours > 0 && remainMins > 0) return `${hours} soat ${remainMins} daq`
    if (hours > 0) return `${hours} soat`
    if (mins > 0) return `${mins} daqiqa`
    return `< 1 daqiqa`
}

const StudentDashboard = () => {
    const [userCount, setUserCount] = useState(0)
    const [todaySecs, setTodaySecs] = useState(0)
    const [totalSecs, setTotalSecs] = useState(0)
    const [userId, setUserId] = useState(null)
    const [rank, setRank] = useState(null)

    // ── Fetch initial data from Supabase ─────────────────────────────
    useEffect(() => {
        const init = async () => {
            const { data: all } = await supabase.from('profiles').select('id')
            if (all) setUserCount(all.length)

            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return
            setUserId(user.id)

            const { data: profile } = await supabase
                .from('profiles')
                .select('time_spent, today_time_spent, last_active_date')
                .eq('id', user.id)
                .single()

            if (!profile) return

            const d = new Date()
            const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
            const isToday = profile.last_active_date === today

            setTodaySecs(isToday ? (profile.today_time_spent || 0) : 0)
            setTotalSecs(profile.time_spent || 0)
            const currentRank = await fetchCurrentUserRank()
            setRank(currentRank)
        }
        init()
    }, [])

    // ── Subscribe to Supabase realtime to reflect GlobalSessionTracker ─
    useEffect(() => {
        if (!userId) return
        const POLL_MS = 10_000
        const poll = setInterval(async () => {
            const { data } = await supabase
                .from('profiles')
                .select('time_spent, today_time_spent')
                .eq('id', userId)
                .single()
            if (data) {
                setTodaySecs(data.today_time_spent || 0)
                setTotalSecs(data.time_spent || 0)
            }
            const currentRank = await fetchCurrentUserRank()
            setRank(currentRank)
        }, POLL_MS)
        return () => clearInterval(poll)
    }, [userId])

    const dataStudent = [
        {
            id: 1,
            title: "Foydalanuvchilar",
            value: `${userCount} ta`,
            icon: "/assets/users.png",
            color: "bg-[#0097F6]",
        },
        {
            id: 2,
            title: "Reytingim",
            value: rank ? `${rank}-o'rin` : "— o'rin",
            icon: "/assets/yourRank.png",
            color: "bg-[#E641B4]",
        },
        {
            id: 3,
            title: "Bugun",
            value: userId ? formatTime(todaySecs) : "—",
            icon: "/assets/todayTime.png",
            color: "bg-[#00C463]",
        },
        {
            id: 4,
            title: "Umumiy",
            value: userId ? formatTime(totalSecs) : "—",
            icon: "/assets/allTime.png",
            color: "bg-[#94CF13]",
        },
    ]

    return (
        <div className='grid grid-cols-1 sm:grid-cols-2 w-full justify-between xl:grid-cols-4 gap-2'>
            {dataStudent.map((item) => (
                <div key={item.id} className='flex justify-between w-full bg-white p-4 sm:p-6 rounded-2xl shadow-xl transition-all hover:shadow-2xl shadow-gray-200'>
                    <div className='flex flex-col justify-between gap-1'>
                        <h2 className='text-[16px] lg:text-[20px] font-medium'>{item.title}</h2>
                        <h1 className='text-[13px] lg:text-[15px] text-gray-700 font-semibold'>{item.value}</h1>
                    </div>
                    <div className={`${item.color} p-2.5 w-max h-max rounded-2xl`}>
                        <Image src={item.icon} alt='icon' width={0} height={0} className='min-w-7 min-h-7 lg:min-w-8 lg:min-h-8' />
                    </div>
                </div>
            ))}
        </div>
    )
}

export default StudentDashboard