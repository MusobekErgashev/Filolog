'use client'

import Login from '@/components/Login'
import Register from '@/components/Register'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const Auth = () => {
    const [state, setState] = useState(true)
    const [session, setSession] = useState(null)
    const [regStep, setRegStep] = useState(1)

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
        })

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })

        return () => subscription.unsubscribe()
    }, [])

    if (session) {
        return (
            <div className='w-full min-h-screen bg-gray-50 flex flex-col justify-center items-center fixed top-0 left-0 z-50 p-4'>
                <div className='bg-white p-10 rounded-3xl shadow-2xl text-center max-w-md w-full'>
                    <div className='w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-6'>
                        <svg className='w-10 h-10' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M5 13l4 4L19 7' />
                        </svg>
                    </div>
                    <h2 className='text-2xl font-bold mb-2'>Siz tizimga kirdingiz!</h2>
                    <p className='text-gray-500 mb-8'>Xush kelibsiz, platformadan to‘liq foydalanishingiz mumkin.</p>
                    <div className='flex flex-col gap-3'>
                        <button 
                            onClick={() => window.location.href = '/'}
                            className='w-full py-3 bg-[#006EDD] text-white rounded-xl font-bold hover:bg-[#0052a3] transition-all'
                        >
                            Bosh sahifaga o‘tish
                        </button>
                        <button 
                            onClick={() => supabase.auth.signOut()}
                            className='w-full py-3 border border-gray-200 text-gray-600 rounded-xl font-semibold hover:bg-gray-50 transition-all'
                        >
                            Chiqish
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className='w-full min-h-screen bg-gray-50 text-[#0F172B] flex justify-center items-center fixed top-0 left-0 z-50 overflow-y-auto py-10 px-4'>
            <div className='w-full max-w-[1000px] h-auto min-h-[600px] rounded-3xl flex flex-col md:flex-row bg-white shadow-2xl overflow-hidden'>
                <div className='w-full md:w-1/2 bg-[#006EDD] hidden md:flex flex-col justify-center items-center p-12 relative'>
                    <div className='absolute inset-0 bg-linear-to-br from-[#006EDD] to-[#0052a3] opacity-90'></div>
                    <div className='relative z-10 w-full flex flex-col items-center'>
                         <Image 
                            src={state ? "/assets/login.jpeg" : "/assets/register.jpeg"} 
                            alt='Auth Image' 
                            width={400} 
                            height={400} 
                            className="w-full rounded-2xl shadow-xl transform transition-transform duration-700 hover:scale-105" 
                        />
                        <div className='mt-8 text-center text-white'>
                            <h2 className='text-2xl font-bold mb-2'>{state ? 'Xush kelibsiz!' : "Bizga qo'shiling!"}</h2>
                            <p className='text-blue-100 font-light'>{state ? "O'z hisobingizga kiring va o'qishni davom ettiring" : "Ro'yxatdan o'ting va yangi imkoniyatlarni kashf qiling"}</p>
                        </div>
                    </div>
                </div>

                <div className='w-full md:w-1/2 p-6 md:p-10 flex flex-col'>
                    <div className='flex justify-center mb-8'>
                        <Image src={'/assets/logo.png'} alt='logo' width={150} height={60} className='w-36 h-auto' />
                    </div>

                    {!state && regStep === 2 ? (
                        <div className='w-full py-3 px-4 bg-blue-50 text-[#006EDD] rounded-2xl text-xs font-bold flex items-center justify-center gap-2 mb-8 anim-fade-in'>
                            <div className='w-2 h-2 bg-[#006EDD] rounded-full animate-pulse'></div>
                            Emailni tasdiqlash kutilmoqda
                        </div>
                    ) : (
                        <div className='w-full p-1 bg-gray-100 rounded-2xl flex relative mb-8'>
                            <button 
                                className={`flex-1 py-3 cursor-pointer text-sm font-semibold transition-all duration-300 relative z-10 ${state ? 'text-[#006EDD]' : 'text-gray-500'}`}
                                onClick={() => setState(true)}
                            >
                                Kirish
                            </button>
                            <button 
                                className={`flex-1 py-3 cursor-pointer text-sm font-semibold transition-all duration-300 relative z-10 ${!state ? 'text-[#006EDD]' : 'text-gray-500'}`}
                                onClick={() => {
                                    setState(false)
                                    setRegStep(1)
                                }}
                            >
                                {`Ro'yxatdan o'tish`}
                            </button>
                            <div 
                                className={`absolute top-1 bottom-1 w-[calc(50%-8px)] bg-white rounded-xl shadow-md transition-all duration-500 ease-in-out transform ${state ? 'left-1' : 'left-1/2 ml-1'}`}
                            ></div>
                        </div>
                    )}

                    <div className='flex-1'>
                        {state ? <Login /> : <Register onStepChange={(step) => setRegStep(step)} />}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Auth