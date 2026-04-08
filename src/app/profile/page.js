'use client'

import React, { useState } from 'react'
import { Edit3, Download, Calendar, Heart, Brain, LogOut } from 'lucide-react'
import UpdateProfileModal from '@/components/UpdateProfileModal'
import ConfirmModal from '@/components/ConfirmModal'
import { supabase } from '@/lib/supabase'

/** Telegram-style avatar: real photo or gradient + initials */
function AvatarDisplay({ avatarUrl, name }) {
    const gradients = [
        ['#6C63FF', '#9b5de5'], ['#0097F6', '#00C4FF'],
        ['#E641B4', '#FF6B9D'], ['#FF6B35', '#FFB347'],
        ['#00C463', '#4ECDC4'], ['#43464B', '#747D8C'],
    ]
    let hash = 0
    for (const c of (name || '')) hash = (hash * 31 + c.charCodeAt(0)) & 0xffff
    const [c1, c2] = gradients[hash % gradients.length]
    const initials = (name || '?').split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()

    if (avatarUrl) {
        return (
            <img
                src={avatarUrl}
                alt="avatar"
                className="w-full h-full object-cover"
            />
        )
    }
    return (
        <div
            className="w-full h-full flex items-center justify-center text-4xl sm:text-5xl font-black text-white"
            style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}
        >
            {initials}
        </div>
    )
}

const Page = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const [user, setUser] = useState({
    name: "Yuklanmoqda...",
    username: "@user",
    bio: "Filologiya bo'yicha mutaxassis va kitobsevar.",
    joinDate: "...",
    joinDate: "...",
    avatar: "",
    stats: [
      { label: "Saqlangan kitoblar", count: 0, icon: <Heart size={18} className="text-pink-500" /> },
      { label: "Yechilgan testlar", count: 0, icon: <Brain size={18} className="text-blue-500" /> },
      { label: "Yuklangan kitoblar", count: 0, icon: <Download size={18} className="text-green-500" /> },
    ]
  })

  const [loading, setLoading] = useState(true)

  React.useEffect(() => {
    async function getUserData() {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (authUser) {
        const { data: profile } = await supabase.from('profiles').select('tests_taken, first_name, last_name, avatar').eq('id', authUser.id).single();

        const firstName = profile?.first_name || authUser.user_metadata?.first_name || authUser.user_metadata?.given_name || ''
        const lastName = profile?.last_name || authUser.user_metadata?.last_name || authUser.user_metadata?.family_name || ''
        // For Google OAuth users, full name is in user_metadata.name or user_metadata.full_name
        const googleFullName = authUser.user_metadata?.name || authUser.user_metadata?.full_name || ''
        const displayName = [firstName, lastName].filter(Boolean).join(' ') || googleFullName || ''

        // Only accept real URLs (http/https), reject local /assets/ paths saved by old code
        const isRealUrl = (url) => url && url.startsWith('http')
        const rawAvatar = profile?.avatar || authUser.user_metadata?.avatar_url || authUser.user_metadata?.picture || ''
        const avatarUrl = isRealUrl(rawAvatar) ? rawAvatar : ''

        setUser(prev => {
          const newStats = [...prev.stats];
          newStats[1].count = profile?.tests_taken || 0;
          return {
            ...prev,
            name: displayName,
            username: (authUser.email || ""),
            joinDate: new Date(authUser.created_at).toLocaleDateString('uz-UZ'),
            avatar: avatarUrl,
            stats: newStats
          }
        })
      }
      setLoading(false)
    }
    getUserData()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-[#F5F8FB] pb-20 text-slate-900">
      <div className="relative">
        <div className='h-48 sm:h-64 bg-linear-to-r from-[#8144FE] to-[#5A2DB2] rounded-t-2xl rounded-b-[30px] shadow-lg overflow-hidden'>
          <div className="absolute inset-0 opacity-45 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        </div>

        <div className="container mx-auto px-4 -mt-24 sm:-mt-32 relative z-10 text-slate-900">
          <div className="bg-white rounded-3xl bg-linear-to-r from-[#fcfaff] to-white shadow-xl shadow-blue-100/50 p-6 sm:p-8 flex flex-col md:flex-row items-center md:items-end gap-6 text-slate-900">
            <div className="relative group">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl border-4 border-white shadow-xl overflow-hidden bg-white">
                <AvatarDisplay avatarUrl={user.avatar} name={user.name} />
              </div>
            </div>

            <div className="flex-1 text-center md:text-left flex flex-col gap-1 text-slate-900">
              <h1 className="text-3xl sm:text-4xl font-bold text-[#0F172B]">{user.name}</h1>
              <p className="text-indigo-600 font-medium mb-3">{user.username}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-[#45556C] text-sm">
                <span className="flex items-center gap-1.5 bg-gray-100 px-3 py-1 rounded-full">
                  <Calendar size={14} /> {user.joinDate}{` da qo'shilgan`}
                </span>
              </div>
            </div>

            <div className="flex gap-3 mt-4 md:mt-0">
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 cursor-pointer bg-[#8144FE] hover:bg-[#6c34e0] text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-200"
              >
                <Edit3 size={18} /> Profilni tahrirlash
              </button>
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="p-2.5 border-2 border-gray-200 cursor-pointer rounded-xl hover:bg-red-50 hover:border-red-200 transition-colors text-gray-700 hover:text-red-500"
              >
                <LogOut size={22} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col mt-8 px-4 container mx-auto gap-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {user.stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg shadow-blue-100/50 p-5 flex items-center justify-between border border-transparent hover:border-indigo-100 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
                  {stat.icon}
                </div>
                <span className="text-[#45556C] font-medium">{stat.label}</span>
              </div>
              <span className="text-2xl font-bold text-[#0F172B]">{stat.count}</span>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen ? <UpdateProfileModal setIsModalOpen={setIsModalOpen} /> : ""}
      {showLogoutConfirm && (
        <ConfirmModal
          title="Chiqmoqchimisiz?"
          message="Tizimdan chiqish uchun tasdiqlang."
          confirmText="Ha, chiqish"
          cancelText="Bekor qilish"
          onConfirm={handleLogout}
          onCancel={() => setShowLogoutConfirm(false)}
        />
      )}
    </div>
  )
}

export default Page