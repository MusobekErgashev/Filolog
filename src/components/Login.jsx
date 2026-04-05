'use client'

import React, { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react'

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setErrorMsg("")

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      if (data.user) {
        window.location.href = '/dashboard'
      }
    } catch (err) {
      setErrorMsg(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleLogin() {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/dashboard'
        }
      })
      if (error) throw error
    } catch (err) {
      setErrorMsg(err.message)
      setLoading(false)
    }
  }

  const inputClasses = "w-full bg-gray-50 outline-none px-11 py-3.5 text-[14px] text-[#0F172B] rounded-2xl border border-gray-200 focus:border-[#006EDD] focus:ring-4 focus:ring-[#006fdd10] transition-all duration-300 placeholder:text-gray-400 disabled:opacity-50"
  const labelClasses = "text-sm font-semibold text-gray-700 ml-1"

  return (
    <div className='flex flex-col h-full anim-fade-in py-2'>
      <form onSubmit={handleLogin} className='flex flex-col gap-6'>
        <div className="flex flex-col gap-1.5">
          <label className={labelClasses} htmlFor="email">Email manzili</label>
          <div className='relative'>
            <div className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400'>
              <Mail size={18} />
            </div>
            <input
              required
              disabled={loading}
              className={inputClasses}
              id="email"
              type="email"
              placeholder="example@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center ml-1">
            <label className={labelClasses} htmlFor="password">Parol</label>
          </div>
          <div className='relative'>
            <div className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400'>
              <Lock size={18} />
            </div>
            <input
              required
              disabled={loading}
              className={inputClasses}
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        {errorMsg && (
          <p className='text-red-500 text-xs font-medium bg-red-50 p-3 rounded-xl border border-red-100 flex items-center gap-2'>
            <span className='w-1.5 h-1.5 bg-red-500 rounded-full shrink-0'></span>
            {errorMsg}
          </p>
        )}

        <button 
          disabled={loading}
          className='w-full py-4 rounded-2xl cursor-pointer text-white font-bold text-[16px] transition-all duration-300 bg-[#006EDD] hover:bg-[#0052a3] shadow-lg shadow-[#006fdd20] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed'
        >
          {loading ? <Loader2 className='animate-spin' size={20} /> : (
            <>
                Tizimga kirish
                <ArrowRight size={18} />
            </>
          )}
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