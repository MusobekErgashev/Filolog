'use client'

import React, { useState } from 'react'
import { supabase } from '@/lib/supabase'

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  async function formSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setErrorMsg("")

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (signInError) throw signInError

      if (data.user) {
        console.log("Kirdi:", data.user)
        // Refresh or redirect can happen here if not handled by a global auth listener
        window.location.reload() 
      }
    } catch (err) {
      setErrorMsg(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleLogin() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    })
    if (error) setErrorMsg(error.message)
  }

  return (
    <div className='flex flex-col h-full anim-fade-in'>
      <form action="" onSubmit={formSubmit} className='flex flex-col gap-5'>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700 ml-1" htmlFor="email">Email manzili</label>
          <input
            required
            disabled={loading}
            className="w-full bg-gray-50 outline-none px-4 py-3.5 text-[14px] text-[#0F172B] rounded-2xl border border-gray-200 focus:border-[#006EDD] focus:ring-4 focus:ring-[#006fdd10] transition-all duration-300 placeholder:text-gray-400 disabled:opacity-50"
            id="email"
            type="email"
            placeholder="example@mail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center ml-1">
            <label className="text-sm font-semibold text-gray-700" htmlFor="password">Parol</label>
            <button type="button" className="text-xs font-medium text-[#006EDD] cursor-pointer hover:underline transition-all">Parolni unutdingizmi?</button>
          </div>
          <input
            required
            disabled={loading}
            className="w-full bg-gray-50 outline-none px-4 py-3.5 text-[14px] text-[#0F172B] rounded-2xl border border-gray-200 focus:border-[#006EDD] focus:ring-4 focus:ring-[#006fdd10] transition-all duration-300 placeholder:text-gray-400 disabled:opacity-50"
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <p className={`text-[#F84800] text-[13px] text-center font-medium transition-opacity duration-300 ${errorMsg ? 'opacity-100' : 'opacity-0'}`}>
          {errorMsg || 'Xatolik yuz berdi!'}
        </p>

        <button 
          disabled={loading}
          className='w-full py-4 rounded-2xl cursor-pointer text-white font-bold text-[16px] transition-all duration-300 bg-[#006EDD] hover:bg-[#0052a3] shadow-lg shadow-[#006fdd20] active:scale-[0.98] mt-2 disabled:bg-gray-400 disabled:shadow-none'
        >
          {loading ? "Yuklanmoqda..." : "Kirish"}
        </button>
      </form>

      <div className="mt-8 flex flex-col gap-5">
        <div className="relative flex items-center justify-center">
          <div className="border-t border-gray-200 w-full"></div>
          <span className="bg-white px-4 text-xs font-medium text-gray-400 absolute">Yoki</span>
        </div>

        <button 
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full py-3.5 cursor-pointer px-4 border border-gray-200 rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 font-semibold text-gray-700 active:scale-[0.98] disabled:opacity-50"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.07-3.71 1.07-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Google orqali kirish
        </button>
      </div>
    </div>
  )
}

export default Login