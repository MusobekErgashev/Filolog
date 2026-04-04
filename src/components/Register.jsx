'use client'

import React, { useReducer, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Mail, Lock, User, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react'

const initialState = {
  email: "",
  password: "",
  confirmPassword: "",
  name: "",
  surName: "",
  otp: ""
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

const Register = ({ onStepChange }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [step, _setStep] = useState(1) // 1: Form, 2: OTP

  const setStep = (newStep) => {
    _setStep(newStep)
    if (onStepChange) onStepChange(newStep)
  }

  async function handleSignUp(e) {
    e.preventDefault()
    setLoading(true)
    setErrorMsg("")

    if (state.password !== state.confirmPassword) {
      setErrorMsg("Parollar mos kelmadi!")
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: state.email,
        password: state.password,
        options: {
          data: {
            full_name: state.name,
            surname: state.surName,
          },
          emailRedirectTo: window.location.origin + '/dashboard'
        }
      })

      if (error) throw error

      if (data.user) {
        setStep(2)
      }
    } catch (err) {
      setErrorMsg(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleVerifyOtp(e) {
    e.preventDefault()
    setLoading(true)
    setErrorMsg("")

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: state.email,
        token: state.otp,
        type: 'signup'
      })

      if (error) throw error

      if (data.session) {
        window.location.href = '/dashboard'
      }
    } catch (err) {
      setErrorMsg(err.message)
    } finally {
      setLoading(false)
    }
  }

  const inputClasses = "w-full bg-gray-50 outline-none px-11 py-3.5 text-[14px] text-[#0F172B] rounded-2xl border border-gray-200 focus:border-[#006EDD] focus:ring-4 focus:ring-[#006fdd10] transition-all duration-300 placeholder:text-gray-400 disabled:opacity-50"
  const labelClasses = "text-sm font-semibold text-gray-700 ml-1"

  if (step === 2) {
    return (
      <div className='flex flex-col gap-6 anim-fade-in py-4'>
        <div className='text-center space-y-2'>
          <div className='w-16 h-16 bg-blue-50 text-[#006EDD] rounded-2xl flex items-center justify-center mx-auto mb-4'>
            <Mail size={32} />
          </div>
          <h2 className='text-2xl font-bold text-gray-900'>Emailni tasdiqlang</h2>
          <p className='text-gray-500 text-sm'>
            Biz <span className='font-semibold text-gray-900'>{state.email}</span> manziliga 6 xonali tasdiqlash kodini yubordik.
          </p>
        </div>

        <form onSubmit={handleVerifyOtp} className='flex flex-col gap-5'>
          <div className='flex flex-col gap-2'>
            <label className={labelClasses} htmlFor="otp">Tasdiqlash kodi</label>
            <div className='relative'>
              <div className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400'>
                <Lock size={18} />
              </div>
              <input
                required
                disabled={loading}
                className={inputClasses}
                id="otp"
                type="text"
                maxLength="6"
                placeholder="123456"
                value={state.otp}
                onChange={e => dispatch({ type: 'SET_FIELD', field: 'otp', value: e.target.value.replace(/\D/g, '') })}
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
            {loading ? <Loader2 className='animate-spin' size={20} /> : "Tasdiqlash"}
          </button>

          <button 
                type="button"
                onClick={() => setStep(1)}
                className='text-sm font-semibold text-gray-500 hover:text-[#006EDD] transition-colors flex items-center justify-center gap-1'
          >
              Emailni o&apos;zgartirish
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className='flex flex-col h-full anim-fade-in py-2'>
      <form onSubmit={handleSignUp} className='flex flex-col gap-4'>
        <div className='flex gap-4'>
          <div className="flex-1 flex flex-col gap-1.5">
            <label className={labelClasses} htmlFor="name">Ism</label>
            <div className='relative'>
              <div className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400'>
                <User size={18} />
              </div>
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
          </div>
          <div className="flex-1 flex flex-col gap-1.5">
            <label className={labelClasses} htmlFor="surname">Familiya</label>
            <div className='relative'>
              <div className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400'>
                <User size={18} />
              </div>
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
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClasses} htmlFor="reg-email">Email manzili</label>
          <div className='relative'>
            <div className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400'>
              <Mail size={18} />
            </div>
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
        </div>

        <div className='flex gap-4'>
          <div className="flex-1 flex flex-col gap-1.5">
            <label className={labelClasses} htmlFor="reg-password">Parol</label>
            <div className='relative'>
              <div className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400'>
                <Lock size={18} />
              </div>
              <input
                required
                minLength={6}
                disabled={loading}
                className={inputClasses}
                id="reg-password"
                type="password"
                placeholder="••••••••"
                value={state.password}
                onChange={e => dispatch({ type: 'SET_FIELD', field: 'password', value: e.target.value })}
              />
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-1.5">
            <label className={labelClasses} htmlFor="confirmpassword">Tasdiqlash</label>
            <div className='relative'>
              <div className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400'>
                <Lock size={18} />
              </div>
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
        </div>

        {errorMsg && (
          <p className='text-red-500 text-xs font-medium bg-red-50 p-3 rounded-xl border border-red-100 flex items-center gap-2'>
            <span className='w-1.5 h-1.5 bg-red-500 rounded-full shrink-0'></span>
            {errorMsg}
          </p>
        )}

        <button 
          disabled={loading}
          className='w-full py-4 rounded-2xl cursor-pointer text-white font-bold text-[16px] transition-all duration-300 bg-[#006EDD] hover:bg-[#0052a3] shadow-lg shadow-[#006fdd20] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2'
        >
          {loading ? <Loader2 className='animate-spin' size={20} /> : (
            <>
                Ro&apos;yxatdan o&apos;tish
                <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>
    </div>
  )
}

export default Register