'use client'

import React, { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react'

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  // Forgot Password States
  const [forgotMode, setForgotMode] = useState(false)
  const [resetStep, setResetStep] = useState(1) // 1: Email, 2: OTP, 3: New Pass
  const [resetEmail, setResetEmail] = useState("")
  const [otpCode, setOtpCode] = useState("")
  const [newPassword, setNewPassword] = useState("")

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        if (error.message.includes("Invalid login credentials") || error.status === 400) {
            setErrors({ general: "Pochta yoki parol xato kiritildi. Iltimos tekshiring." })
        } else {
            setErrors({ general: error.message })
        }
        setLoading(false)
        return
      }

      if (data.user) {
        window.location.href = '/dashboard'
      }
    } catch (err) {
      setErrors({ general: err.message })
    } finally {
      setLoading(false)
    }
  }

  async function handleSendResetEmail(e) {
    e.preventDefault()
    setLoading(true)
    setErrors({})
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail)
      if (error) throw error
      setResetStep(2)
    } catch (err) {
      setErrors({ general: err.message })
    } finally {
      setLoading(false)
    }
  }

  async function handleVerifyRecoveryOtp(e) {
    e.preventDefault()
    setLoading(true)
    setErrors({})
    try {
      const { error } = await supabase.auth.verifyOtp({ 
        email: resetEmail, 
        token: otpCode, 
        type: 'recovery' 
      })
      if (error) {
        setErrors({ otp: "Tasdiqlash kodi xato kiritildi." })
        setLoading(false)
        return
      }
      setResetStep(3)
    } catch (err) {
      setErrors({ general: err.message })
    } finally {
      setLoading(false)
    }
  }

  async function handleUpdatePassword(e) {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    const passwordRegex = /^(?=.*[0-9]).{6,}$/
    if (!passwordRegex.test(newPassword)) {
      setErrors({ password: "Parol kamida 6 ta belgidan iborat bo'lishi va kamida 1 ta raqam qatnashishi kerak!" })
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) throw error
      window.location.href = '/dashboard'
    } catch (err) {
      setErrors({ general: err.message })
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
      setErrors({ general: err.message })
      setLoading(false)
    }
  }

  const inputClasses = "w-full bg-gray-50 outline-none px-11 py-3.5 text-[14px] text-[#0F172B] rounded-2xl border border-gray-200 focus:border-[#006EDD] focus:ring-4 focus:ring-[#006fdd10] transition-all duration-300 placeholder:text-gray-400 disabled:opacity-50"
  const labelClasses = "text-sm font-semibold text-gray-700 ml-1"

  if (forgotMode) {
    return (
      <div className='flex flex-col h-full anim-fade-in py-2'>
        <div className='text-center space-y-2 mb-6'>
          <h2 className='text-2xl font-bold text-gray-900'>
            {resetStep === 1 && "Parolni tiklash"}
            {resetStep === 2 && "Emailni tasdiqlang"}
            {resetStep === 3 && "Yangi parol"}
          </h2>
          <p className='text-gray-500 text-sm'>
            {resetStep === 1 && "Pochta manzilingizni kiriting, biz sizga tiklash kodini yuboramiz."}
            {resetStep === 2 && `${resetEmail} manziliga kelgan 6 xonali kodni kiriting.`}
            {resetStep === 3 && "Yangi xavfsiz parolingizni o'rnating."}
          </p>
        </div>

        {resetStep === 1 && (
          <form onSubmit={handleSendResetEmail} className='flex flex-col gap-6'>
            <div className="flex flex-col gap-1.5">
              <label className={labelClasses} htmlFor="reset-email">Email manzili</label>
              <div className='relative'>
                <div className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400'>
                  <Mail size={18} />
                </div>
                <input
                  required
                  disabled={loading}
                  className={inputClasses}
                  id="reset-email"
                  type="email"
                  placeholder="example@mail.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                />
              </div>
            </div>
            
            {errors.general && (
              <p className='text-red-500 text-xs font-medium bg-red-50 p-3 rounded-xl border border-red-100 flex items-center gap-2'>
                <span className='w-1.5 h-1.5 bg-red-500 rounded-full shrink-0'></span>
                {errors.general}
              </p>
            )}

            <button 
              disabled={loading}
              className='w-full py-4 rounded-2xl cursor-pointer text-white font-bold text-[16px] transition-all duration-300 bg-[#006EDD] hover:bg-[#0052a3] shadow-lg shadow-[#006fdd20] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed'
            >
              {loading ? <Loader2 className='animate-spin' size={20} /> : "Kodni yuborish"}
            </button>
            <button 
              type="button"
              onClick={() => { setForgotMode(false); setErrors({}); }}
              className='text-sm font-semibold text-gray-500 hover:text-[#006EDD] transition-colors mt-2 mx-auto cursor-pointer'
            >
              Ortga qaytish
            </button>
          </form>
        )}

        {resetStep === 2 && (
          <form onSubmit={handleVerifyRecoveryOtp} className='flex flex-col gap-6'>
            <div className="flex flex-col gap-1.5">
              <label className={labelClasses} htmlFor="otp-code">Tasdiqlash kodi</label>
              <div className='relative'>
                <div className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400'>
                  <Lock size={18} />
                </div>
                <input
                  required
                  disabled={loading}
                  className={inputClasses}
                  id="otp-code"
                  type="text"
                  maxLength="6"
                  placeholder="123456"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                />
              </div>
              {errors.otp && <p className='text-red-500 text-xs font-semibold ml-1'>{errors.otp}</p>}
            </div>

            {errors.general && (
            <p className='text-red-500 text-xs font-medium bg-red-50 p-3 rounded-xl border border-red-100 flex items-center gap-2'>
              <span className='w-1.5 h-1.5 bg-red-500 rounded-full shrink-0'></span>
              {errors.general}
            </p>
            )}

            <button 
              disabled={loading}
              className='w-full py-4 rounded-2xl cursor-pointer text-white font-bold text-[16px] transition-all duration-300 bg-[#006EDD] hover:bg-[#0052a3] shadow-lg shadow-[#006fdd20] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed'
            >
              {loading ? <Loader2 className='animate-spin' size={20} /> : "Tasdiqlash"}
            </button>
            <button 
              type="button"
              onClick={() => setResetStep(1)}
              className='text-sm font-semibold text-gray-500 hover:text-[#006EDD] transition-colors mt-2 mx-auto cursor-pointer'
            >
              Boshqa pochtaga jo&apos;natish
            </button>
          </form>
        )}

        {resetStep === 3 && (
          <form onSubmit={handleUpdatePassword} className='flex flex-col gap-6'>
            <div className="flex flex-col gap-1.5">
              <label className={labelClasses} htmlFor="new-password">Yangi parol</label>
              <div className='relative'>
                <div className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400'>
                  <Lock size={18} />
                </div>
                <input
                  required
                  disabled={loading}
                  className={inputClasses}
                  id="new-password"
                  type="password"
                  placeholder="Yangi parol (6+ harf va raqam)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              {errors.password && <p className='text-red-500 text-xs font-semibold ml-1'>{errors.password}</p>}
            </div>

            {errors.general && (
            <p className='text-red-500 text-xs font-medium bg-red-50 p-3 rounded-xl border border-red-100 flex items-center gap-2'>
              <span className='w-1.5 h-1.5 bg-red-500 rounded-full shrink-0'></span>
              {errors.general}
            </p>
            )}

            <button 
              disabled={loading}
              className='w-full py-4 rounded-2xl cursor-pointer text-white font-bold text-[16px] transition-all duration-300 bg-[#006EDD] hover:bg-[#0052a3] shadow-lg shadow-[#006fdd20] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed'
            >
              {loading ? <Loader2 className='animate-spin' size={20} /> : "Parolni saqlash va Kirish"}
            </button>
          </form>
        )}
      </div>
    )
  }

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
            <button 
              type="button" 
              onClick={() => { setForgotMode(true); setErrors({}); }} 
              className="text-xs text-[#006EDD] font-medium hover:underline cursor-pointer"
            >
              Parolni unutdingizmi?
            </button>
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

        {errors.general && (
          <p className='text-red-500 text-xs font-medium bg-red-50 p-3 rounded-xl border border-red-100 flex items-center gap-2'>
            <span className='w-1.5 h-1.5 bg-red-500 rounded-full shrink-0'></span>
            {errors.general}
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