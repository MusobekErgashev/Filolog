'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { User, Loader2, CheckCircle2 } from 'lucide-react'

const GoogleProfileModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    const checkProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Google orqali kirganini tekshirish
      const isGoogle = user.app_metadata?.provider === 'google' || 
                       user.identities?.some(id => id.provider === 'google')
      
      if (!isGoogle) return

      // Profile ma'lumotlarini tekshirish
      const { data: profile } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', user.id)
        .single()

      if (profile && (!profile.first_name || !profile.last_name)) {
        setUserId(user.id)
        setIsOpen(true)
      }
    }

    checkProfile()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!firstName.trim() || !lastName.trim()) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          first_name: firstName.trim(),
          last_name: lastName.trim()
        })

      if (error) throw error

      setSuccess(true)
      setTimeout(() => {
        setIsOpen(false)
      }, 1500)
    } catch (err) {
      console.error('Xatolik:', err)
      alert('Ma\'lumotlarni saqlashda xatolik yuz berdi.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />
      
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        {success ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <CheckCircle2 size={40} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Muvaffaqiyatli!</h2>
            <p className="text-slate-500">Ma&apos;lumotlaringiz saqlandi. Endi tizimdan to&apos;liq foydalanishingiz mumkin.</p>
          </div>
        ) : (
          <>
            <div className="bg-linear-to-r from-[#8144FE] to-[#9B6AFF] px-6 py-8 text-center">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/30">
                <User size={32} className="text-white" />
              </div>
              <h2 className="text-white text-xl font-bold">Profilni yakunlang</h2>
              <p className="text-white/70 text-sm mt-1">Google orqali kirdingiz. Iltimos, ism va familiyangizni kiriting.</p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 ml-1">Ismingiz</label>
                <input
                  required
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Ismingizni kiriting"
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#8144FE]/20 focus:border-[#8144FE] outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 ml-1">Familiyangiz</label>
                <input
                  required
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Familiyangizni kiriting"
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#8144FE]/20 focus:border-[#8144FE] outline-none transition-all"
                />
              </div>

              <button
                disabled={loading || !firstName.trim() || !lastName.trim()}
                className="w-full py-4 bg-linear-to-r from-[#8144FE] to-[#9B6AFF] text-white font-bold rounded-2xl shadow-lg shadow-[#8144FE]/20 hover:shadow-[#8144FE]/30 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed mt-2 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : "Saqlash va davom etish"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default GoogleProfileModal
