'use client'

import { X, User, Mail, Lock } from 'lucide-react'
import React, { useState } from 'react'
import { supabase } from '@/lib/supabase'

const UpdateProfileModal = ({ setIsModalOpen }) => {
    const [updatedEmail, setUpdatedEmail] = useState("")
    const [originalEmail, setOriginalEmail] = useState("")
    const [updatedName, setUpdatedName] = useState("")
    const [updatedSurName, setUpdatedSurName] = useState("")
    const [loading, setLoading] = useState(false)
    const [showOtpInput, setShowOtpInput] = useState(false)
    const [otpCode, setOtpCode] = useState("")
    const [errors, setErrors] = useState({})

    React.useEffect(() => {
        const fetchUserData = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                setUpdatedEmail(user.email || "")
                setOriginalEmail(user.email || "")

                const { data: profile } = await supabase
                    .from('profiles')
                    .select('first_name, last_name')
                    .eq('id', user.id)
                    .single()

                if (profile) {
                    setUpdatedName(profile.first_name || "")
                    setUpdatedSurName(profile.last_name || "")
                }
            }
        }
        fetchUserData()
    }, [])

    async function submitFunc(e) {
        e.preventDefault()
        setLoading(true)
        setErrors({})

        try {
            if (showOtpInput) {
                const { error: otpError } = await supabase.auth.verifyOtp({
                    email: updatedEmail,
                    token: otpCode,
                    type: 'email_change'
                })

                if (otpError) {
                    setErrors({ general: otpError.message })
                    setLoading(false)
                    return
                }

                await saveProfileData()
                return
            }

            if (updatedEmail !== originalEmail) {
                const { error: emailError } = await supabase.auth.updateUser({ email: updatedEmail })
                if (emailError) {
                    if (emailError.message.includes('already registered') || emailError.status === 422) {
                        setErrors({ email: "Bu pochta allaqachon ro'yxatdan o'tgan." })
                    } else {
                        setErrors({ general: emailError.message })
                    }
                    setLoading(false)
                    return
                }
                
                setShowOtpInput(true)
                setLoading(false)
                return
            }

            await saveProfileData()
        } catch (error) {
            setErrors({ general: error.message })
            setLoading(false)
        }
    }

    async function saveProfileData() {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('Foydalanuvchi topilmadi')

            const { error: profileError } = await supabase
                .from('profiles')
                .update({
                    first_name: updatedName,
                    last_name: updatedSurName,
                })
                .eq('id', user.id)

            if (profileError) throw profileError

            window.location.reload()
            setIsModalOpen(false)
        } catch (error) {
            setErrors({ general: error.message })
            setLoading(false)
        }
    }

    return (
        <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-25 p-4 transition-all duration-300'>
            <div className='bg-white rounded-[32px] shadow-2xl w-full max-w-135 overflow-hidden animate-in fade-in zoom-in duration-300'>
                <div className='relative h-32 bg-linear-to-r from-[#8144FE] to-[#5A2DB2]'>
                    <button 
                        onClick={() => setIsModalOpen(false)} 
                        className='absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full text-white transition-all cursor-pointer z-10'
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className='px-8 pb-8 pt-6 relative'>
                    <div className='flex flex-col items-center mb-8'>
                        <h2 className='text-2xl font-black text-[#0F172B] tracking-tight'>Profilni tahrirlash</h2>
                        <p className='text-gray-500 text-sm mt-1 font-medium'>Ma&apos;lumotlaringizni yangilang</p>
                    </div>

                    {showOtpInput ? (
                        <form className='flex flex-col gap-5' onSubmit={submitFunc}>
                            <div className='bg-blue-50 p-4 rounded-xl text-blue-800 text-sm font-medium'>
                                {updatedEmail} manziliga 6-xonali tasdiqlash kodi yuborildi. Iltimos, pochtangizni tekshiring.
                            </div>
                            <div className='group'>
                                <div className='h-14 flex items-center px-4 bg-gray-50/50 rounded-2xl border border-gray-100 focus-within:border-[#8144FE] focus-within:bg-white transition-all'>
                                    <Lock size={18} className='text-gray-400 group-focus-within:text-[#8144FE] transition-colors shrink-0' />
                                    <input
                                        required
                                        placeholder="Tasdiqlash kodi (6 xonali)"
                                        className="w-full h-full bg-transparent outline-none ml-3 text-[16px] font-medium text-[#0F172B]"
                                        type="text"
                                        maxLength={6}
                                        value={otpCode}
                                        onChange={(e) => setOtpCode(e.target.value)}
                                    />
                                </div>
                            </div>
                            
                            <button 
                                disabled={loading || otpCode.length < 6}
                                type="submit" 
                                className="w-full bg-[#8144FE] text-white h-14 rounded-2xl font-black text-lg hover:bg-[#6c34e0] transition-all transform active:scale-[0.98] shadow-lg shadow-indigo-100 mt-2 cursor-pointer disabled:opacity-70"
                            >
                                {loading ? "Tekshirilmoqda..." : "Tasdiqlash va saqlash"}
                            </button>
                            <button 
                                type="button"
                                onClick={() => setShowOtpInput(false)}
                                className="w-full text-gray-500 font-medium hover:text-gray-800 mt-2 cursor-pointer"
                            >
                                Bekor qilish
                            </button>
                        </form>
                    ) : (
                        <form className='flex flex-col gap-5' onSubmit={submitFunc}>
                            <div className='flex gap-4'>
                                <div className='flex-1 group'>
                                    <div className='h-14 flex items-center px-4 bg-gray-50/50 rounded-2xl border border-gray-100 focus-within:border-[#8144FE] focus-within:bg-white transition-all'>
                                        <User size={18} className='text-gray-400 group-focus-within:text-[#8144FE] transition-colors shrink-0' />
                                        <input
                                            required
                                            placeholder="Ism"
                                            className="w-full h-full bg-transparent outline-none ml-3 text-[16px] font-medium text-[#0F172B]"
                                            type="text"
                                            value={updatedName}
                                            onChange={(e) => setUpdatedName(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className='flex-1 group'>
                                    <div className='h-14 flex items-center px-4 bg-gray-50/50 rounded-2xl border border-gray-100 focus-within:border-[#8144FE] focus-within:bg-white transition-all'>
                                        <input
                                            required
                                            placeholder="Familiya"
                                            className="w-full h-full bg-transparent outline-none text-[16px] font-medium text-[#0F172B]"
                                            type="text"
                                            value={updatedSurName}
                                            onChange={(e) => setUpdatedSurName(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className='group'>
                                <div className='h-14 flex items-center px-4 bg-gray-50/50 rounded-2xl border border-gray-100 focus-within:border-[#8144FE] focus-within:bg-white transition-all'>
                                    <Mail size={18} className='text-gray-400 group-focus-within:text-[#8144FE] transition-colors shrink-0' />
                                    <input
                                        required
                                        placeholder="Elektron pochta"
                                        className="w-full h-full bg-transparent outline-none ml-3 text-[16px] font-medium text-[#0F172B]"
                                        type="email"
                                        value={updatedEmail}
                                        onChange={(e) => setUpdatedEmail(e.target.value)}
                                    />
                                </div>
                            </div>


                            <button 
                                disabled={loading}
                                type="submit" 
                                className="w-full bg-[#8144FE] text-white h-14 rounded-2xl font-black text-lg hover:bg-[#6c34e0] transition-all transform active:scale-[0.98] shadow-lg shadow-indigo-100 mt-2 cursor-pointer disabled:opacity-70"
                            >
                                {loading ? "Saqlanmoqda..." : "O'zgarishlarni saqlash"}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}

export default UpdateProfileModal