'use client'

import { Phone } from 'lucide-react'
import React, { useReducer, useState } from 'react'
import { supabase } from '@/lib/supabase'

const initialState = {
  email: "",
  password: "",
  confirmPassword: "",
  name: "",
  surName: "",
  phone: ""
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value }
    case 'RESET':
      return initialState
    default:
      return state
  }
}

const Register = () => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  async function formSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setErrorMsg("")

    if (state.password !== state.confirmPassword) {
      setErrorMsg("Parollar mos kelmadi!")
      setLoading(false)
      return
    }

    try {
      // 1. Sign up the user
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: state.email,
        password: state.password,
      })

      if (signUpError) throw signUpError

      if (data.user) {
        // 2. Create profile in the 'profiles' table
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              name: state.name,
              surname: state.surName,
              phone: state.phone
            }
          ])

        if (profileError) throw profileError
        
        alert("Ro'yxatdan o'tdingiz! Emailingizni tasdiqlang (agar kerak bo'lsa).")
        dispatch({ type: 'RESET' })
      }
    } catch (err) {
      setErrorMsg(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleRegister() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    })
    if (error) setErrorMsg(error.message)
  }

  const inputClasses = "w-full bg-gray-50 outline-none px-4 py-3 text-[14px] text-[#0F172B] rounded-xl border border-gray-200 focus:border-[#006EDD] focus:ring-4 focus:ring-[#006fdd10] transition-all duration-300 placeholder:text-gray-400 disabled:opacity-50"
  const labelClasses = "text-sm font-semibold text-gray-700 ml-1"

  return (
    <div className='flex flex-col h-full anim-fade-in'>
      <form action="" onSubmit={formSubmit} className='flex flex-col gap-4'>
        <div className='flex gap-4'>
          <div className="flex-1 flex flex-col gap-1">
            <label className={labelClasses} htmlFor="name">Ism</label>
            <input
              required
              disabled={loading}
              className={inputClasses}
              id="name"
              type="text"
              placeholder="Ali"
              value={state.name}
              onChange={e => dispatch({ type: 'SET_FIELD', field: 'name', value: e.target.value })}
            />
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <label className={labelClasses} htmlFor="surname">Familiya</label>
            <input
              required
              disabled={loading}
              className={inputClasses}
              id="surname"
              type="text"
              placeholder="Valiyev"
              value={state.surName}
              onChange={e => dispatch({ type: 'SET_FIELD', field: 'surName', value: e.target.value })}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className={labelClasses} htmlFor="phone">Telefon raqam</label>
          <div className={`flex items-center bg-gray-50 rounded-xl border border-gray-200 focus-within:border-[#006EDD] focus-within:ring-4 focus-within:ring-[#006fdd10] transition-all duration-300 group ${loading ? 'opacity-50' : ''}`}>
            <div className='flex items-center pl-4 gap-2'>
              <Phone size={16} className='text-gray-400 group-focus-within:text-[#006EDD] transition-colors' />
              <div className='flex items-center gap-2 border-r border-gray-200 pr-3 ml-1'>
                <span className='text-[14px] font-bold text-gray-400 group-focus-within:text-[#006EDD] transition-colors'>+998</span>
              </div>
            </div>
            <input
              required
              disabled={loading}
              className="flex-1 bg-transparent outline-none px-4 py-3 text-[14px] text-[#0F172B] placeholder:text-gray-400"
              id="phone"
              type="tel"
              placeholder="90 123 45 67"
              value={state.phone}
              onChange={e => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 9);
                dispatch({ type: 'SET_FIELD', field: 'phone', value: val });
              }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className={labelClasses} htmlFor="reg-email">Email</label>
          <input
            required
            disabled={loading}
            className={inputClasses}
            id="reg-email"
            type="email"
            placeholder="example@mail.com"
            value={state.email}
            onChange={e => dispatch({ type: 'SET_FIELD', field: 'email', value: e.target.value })}
          />
        </div>

        <div className='flex gap-4'>
          <div className="flex-1 flex flex-col gap-1">
            <label className={labelClasses} htmlFor="reg-password">Parol yarating</label>
            <input
              required
              disabled={loading}
              className={inputClasses}
              id="reg-password"
              type="password"
              placeholder="••••••••"
              value={state.password}
              onChange={e => dispatch({ type: 'SET_FIELD', field: 'password', value: e.target.value })}
            />
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <label className={labelClasses} htmlFor="confirmpassword">Tasdiqlash</label>
            <input
              required
              disabled={loading}
              className={inputClasses}
              id="confirmpassword"
              type="password"
              placeholder="••••••••"
              value={state.confirmPassword}
              onChange={e => dispatch({ type: 'SET_FIELD', field: 'confirmPassword', value: e.target.value })}
            />
          </div>
        </div>

        <p className={`text-[#F84800] text-[13px] text-center font-medium transition-opacity duration-300 ${errorMsg ? 'opacity-100' : 'opacity-0'}`}>
          {errorMsg || 'Xatolik yuz berdi!'}
        </p>

        <button 
          disabled={loading}
          className='w-full py-4 rounded-2xl cursor-pointer text-white font-bold text-[16px] transition-all duration-300 bg-[#006EDD] hover:bg-[#0052a3] shadow-lg shadow-[#006fdd20] active:scale-[0.98] mt-2 disabled:bg-gray-400 disabled:shadow-none'
        >
          {loading ? "Yuklanmoqda..." : "Ro'yxatdan o'tish"}
        </button>
      </form>

      <div className="mt-6 flex flex-col gap-4">
        <div className="relative flex items-center justify-center">
          <div className="border-t border-gray-200 w-full"></div>
          <span className="bg-white px-4 text-xs font-medium text-gray-400 absolute">Yoki</span>
        </div>

        <button 
          onClick={handleGoogleRegister}
          disabled={loading}
          className="w-full py-3.5 cursor-pointer px-4 border border-gray-200 rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 font-semibold text-gray-700 active:scale-[0.98] disabled:opacity-50"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.07-3.71 1.07-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          {`Google orqali ro'yxatdan o'tish`}
        </button>
      </div>
    </div>
  )
}

export default Register