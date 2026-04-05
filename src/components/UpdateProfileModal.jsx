'use client'

import { X, Camera, User, Mail, Phone, Lock } from 'lucide-react'
import React, { useState, useRef } from 'react'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'

const UpdateProfileModal = ({ setIsModalOpen }) => {
    const [updatedEmail, setUpdatedEmail] = useState("")
    const [updatedName, setUpdatedName] = useState("")
    const [updatedSurName, setUpdatedSurName] = useState("")
    const [avatarPreview, setAvatarPreview] = useState("/assets/book.webp")
    const [avatarFile, setAvatarFile] = useState(null)
    const [loading, setLoading] = useState(false)
    const fileInputRef = useRef(null)

    React.useEffect(() => {
        const fetchUserData = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                setUpdatedEmail(user.email || "")
                setUpdatedName(user.user_metadata?.full_name || "")
                setUpdatedSurName(user.user_metadata?.surname || "")
                if (user.user_metadata?.avatar_url) {
                    setAvatarPreview(user.user_metadata.avatar_url)
                }
            }
        }
        fetchUserData()
    }, [])

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setAvatarFile(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setAvatarPreview(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    async function submitFunc(e) {
        e.preventDefult()
        setLoading(true)

        try {
            let avatar_url = avatarPreview

            // 1. Upload image if a new one was selected
            if (avatarFile) {
                const fileExt = avatarFile.name.split('.').pop()
                const fileName = `${Math.random()}.${fileExt}`
                const filePath = `avatars/${fileName}`

                const { error: uploadError } = await supabase.storage
                    .from('avatars')
                    .upload(filePath, avatarFile)

                if (uploadError) throw uploadError

                const { data: { publicUrl } } = supabase.storage
                    .from('avatars')
                    .getPublicUrl(filePath)
                
                avatar_url = publicUrl
            }

            // 2. Update user metadata and email
            const { error: updateError } = await supabase.auth.updateUser({
                email: updatedEmail,
                data: {
                    full_name: updatedName,
                    surname: updatedSurName,
                    avatar_url: avatar_url
                }
            })

            if (updateError) throw updateError

            // Redirect or refresh to show changes
            window.location.reload()
            setIsModalOpen(false)
        } catch (error) {
            alert("Error updating profile: " + error.message)
        } finally {
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

                <div className='px-8 pb-8 -mt-16 relative'>
                    <div className='flex flex-col items-center mb-8'>
                        <div className='relative group'>
                            <div className='w-32 h-32 rounded-[2.5rem] border-4 border-white shadow-xl overflow-hidden bg-gray-100 flex items-center justify-center'>
                                <Image
                                    src={avatarPreview}
                                    alt='avatar preview'
                                    width={128}
                                    height={128}
                                    className='w-full h-full object-cover transition-transform group-hover:scale-110 duration-500'
                                />
                                <div className='absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-[2.5rem] transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100'>
                                    <Camera size={24} className='text-white' />
                                </div>
                            </div>
                            <button 
                                onClick={() => fileInputRef.current.click()}
                                className='absolute bottom-1 right-1 p-2.5 bg-[#8144FE] text-white rounded-2xl shadow-lg hover:bg-[#6c34e0] transition-transform hover:scale-110 cursor-pointer border-2 border-white'
                            >
                                <Camera size={18} />
                            </button>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                className='hidden' 
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </div>
                        <h2 className='text-2xl font-black text-[#0F172B] mt-4 tracking-tight'>Profilni tahrirlash</h2>
                        <p className='text-gray-500 text-sm mt-1 font-medium'>Ma&apos;lumotlaringizni yangilang</p>
                    </div>

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
                </div>
            </div>
        </div>
    )
}

export default UpdateProfileModal