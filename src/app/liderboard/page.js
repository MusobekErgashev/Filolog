'use client'

import React, { useState, useEffect } from 'react'
import { Trophy, Medal, Award } from 'lucide-react'
import { fetchLeaderboardWithRanks } from '@/lib/leaderboard'

/** Generate a deterministic gradient from a name string */
function nameToGradient(name = '') {
    const gradients = [
        'from-purple-500 to-indigo-600',
        'from-blue-500 to-cyan-600',
        'from-rose-500 to-pink-600',
        'from-amber-500 to-orange-600',
        'from-green-500 to-teal-600',
        'from-slate-500 to-gray-700',
    ]
    let hash = 0
    for (const c of name) hash = (hash * 31 + c.charCodeAt(0)) & 0xffff
    return gradients[hash % gradients.length]
}

function AvatarOrInitials({ avatarUrl, name, size = "md" }) {
    const initials = (name || '?').split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()
    const gradient = nameToGradient(name)
    const sizeClasses = size === 'lg' ? 'w-full h-full text-xl' : 'w-full h-full text-sm'

    if (avatarUrl) {
        return <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
    }
    return (
        <div className={`bg-linear-to-br ${gradient} ${sizeClasses} flex items-center justify-center text-white font-black rounded-full`}>
            {initials}
        </div>
    )
}

const LeaderboardPage = () => {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchLeaderboard = async () => {
            const rankedUsers = await fetchLeaderboardWithRanks()
            setUsers(rankedUsers)
            setLoading(false)
        }
        fetchLeaderboard()
    }, [])

    const top3 = users.slice(0, 3)
    const others = users.slice(3)
    const podiumOrder = [top3[1], top3[0], top3[2]].filter(Boolean)

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-indigo-300 border-t-indigo-600 rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] md:py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto md:space-y-12">

                {/* Header */}
                <div className="flex flex-col items-center gap-8 text-center">
                    <div className="md:space-y-3">
                        <h1 className="text-[28px] sm:text-[30px] md:text-5xl font-black text-slate-900 tracking-tight">
                            Peshqadamlar <span className="text-indigo-600">Reytingi</span>
                        </h1>
                        <p className="text-slate-500 font-medium text-[16px] sm:text-lg">Platformaning eng faol bilimdonlari bilan tanishing</p>
                    </div>
                </div>

                {/* Podium — need at least 1 user */}
                {top3.length === 0 ? (
                    <div className="flex flex-col items-center gap-4 py-20 text-center">
                        <div className="text-6xl">🏆</div>
                        <h3 className="text-xl font-black text-slate-400">Hali foydalanuvchilar yetarli emas</h3>
                        <p className="text-slate-400 text-sm">Reyting shakllanishi uchun ko'proq foydalanuvchi kerak</p>
                    </div>
                ) : (
                    <div className="flex flex-row items-end justify-center gap-2 sm:gap-4 lg:gap-8 pt-10">
                        {podiumOrder.map((user) => {
                            const isFirst = user.rank === 1
                            const isSecond = user.rank === 2

                            return (
                                <div
                                    key={user.id}
                                    className={`relative flex flex-col items-center bg-white rounded-[24px] sm:rounded-[40px] p-4 sm:p-8 shadow-xl border border-slate-100 transition-all duration-500 hover:-translate-y-2 group flex-1
                                        ${isFirst ? 'h-[230px] sm:h-[420px] border-indigo-100 ring-4 ring-indigo-50/50 scale-105 z-10' :
                                            isSecond ? 'h-[210px] sm:h-[360px]' : 'h-[190px] sm:h-[340px]'}`}
                                >
                                    {/* Badge */}
                                    <div className={`absolute -top-4 sm:-top-6 p-2 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg transform transition-transform group-hover:rotate-12 ${isFirst ? 'bg-indigo-600 text-white' : isSecond ? 'bg-slate-600 text-white' : 'bg-amber-600 text-white'}`}>
                                        {isFirst ? <Trophy className='w-5 h-5 sm:w-7 sm:h-7' /> : isSecond ? <Medal className='w-4 h-4 sm:w-6 sm:h-6' /> : <Award className='w-4 h-4 sm:w-6 sm:h-6' />}
                                    </div>

                                    {/* Avatar */}
                                    <div className="relative mt-2 sm:mt-4 mb-3 sm:mb-6">
                                        <div className={`rounded-full p-1 ${isFirst ? 'w-20 h-20 sm:w-32 sm:h-32 bg-linear-to-tr from-indigo-500 to-purple-600' : 'w-16 h-16 sm:w-24 sm:h-24 bg-slate-200'}`}>
                                            <div className="w-full h-full bg-white rounded-full p-0.5 sm:p-1">
                                                <div className="w-full h-full rounded-full overflow-hidden">
                                                    <AvatarOrInitials avatarUrl={user.avatar} name={user.name} size="lg" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-6 h-6 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-black shadow-lg border-2 sm:border-4 border-white text-[10px] sm:text-base ${isFirst ? 'bg-indigo-600' : isSecond ? 'bg-slate-600' : 'bg-amber-600'}`}>
                                            {user.rank}
                                        </div>
                                    </div>

                                    {/* Name & Diamonds */}
                                    <div className="text-center space-y-1 sm:space-y-2 mt-auto">
                                        <h3 className={`font-black text-slate-800 truncate max-w-[80px] sm:max-w-none ${isFirst ? 'text-sm sm:text-2xl' : 'text-xs sm:text-xl'}`}>
                                            {user.name.split(' ')[0]}
                                        </h3>
                                        <div className={`flex items-center justify-center gap-1 sm:gap-2 font-black ${isFirst ? 'text-indigo-600 text-sm sm:text-xl' : 'text-slate-500 text-xs sm:text-lg'}`}>
                                            <span className="text-sm sm:text-xl transform scale-75 sm:scale-100">💎</span>
                                            <span>{(user.diamonds || 0).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}

                {/* All users list */}
                <div className="bg-white rounded-[24px] sm:rounded-[40px] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden mt-8 sm:mt-12 mb-20 animate-in fade-in duration-700">
                    <div className="px-5 sm:px-8 py-4 sm:py-6 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                        <h2 className="text-base sm:text-xl font-black text-slate-800">Barcha ishtirokchilar</h2>
                        <span className="bg-indigo-100 text-indigo-600 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-black tracking-wider uppercase">
                            {users.length} ta jami
                        </span>
                    </div>

                    <div className="divide-y divide-slate-50">
                        {users.length === 0 ? (
                            <div className="p-10 sm:p-20 text-center space-y-4">
                                <div className="text-4xl sm:text-6xl text-slate-200">👥</div>
                                <h3 className="text-slate-400 text-sm sm:text-base font-bold">Hali foydalanuvchilar yetarli emas</h3>
                            </div>
                        ) : users.map((user) => (
                            <div key={user.id} className="flex items-center justify-between p-4 sm:p-6 hover:bg-slate-50/80 transition-all duration-300 group cursor-pointer">
                                <div className="flex items-center gap-3 sm:gap-6">
                                    <span className="text-sm sm:text-xl font-black text-slate-300 w-6 sm:w-8 text-center group-hover:text-indigo-600 transition-colors">
                                        {user.rank}
                                    </span>
                                    <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full overflow-hidden bg-slate-100 border border-slate-200 group-hover:scale-110 transition-transform">
                                        <AvatarOrInitials avatarUrl={user.avatar} name={user.name} />
                                    </div>
                                    <div className="space-y-0.5">
                                        <h4 className="font-black leading-tight text-slate-800 text-sm sm:text-lg group-hover:text-indigo-600 transition-colors">
                                            {user.name}
                                        </h4>
                                        <p className="text-slate-400 text-[10px] sm:text-sm font-medium">Faol talaba</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 sm:gap-3 bg-slate-50 group-hover:bg-indigo-50 px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-xl sm:rounded-2xl transition-colors">
                                    <span className="text-sm sm:text-xl">💎</span>
                                    <span className="text-[12px] sm:text-xl font-black text-slate-900 group-hover:text-indigo-600">{(user.diamonds || 0).toLocaleString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LeaderboardPage