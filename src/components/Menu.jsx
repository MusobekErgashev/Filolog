'use client'

import Link from 'next/link'
import React from 'react'
import { Pages } from '@/app/pages-export'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import useMenuStore from '@/store/menuStore'
import { X, LogOut } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import ConfirmModal from '@/components/ConfirmModal'

const Menu = () => {
    const pathname = usePathname()
    const { isOpen, closeMenu } = useMenuStore()
    const [user, setUser] = React.useState(null)
    const [userName, setUserName] = React.useState('Foydalanuvchi')
    const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false)

    React.useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('first_name, last_name')
                    .eq('id', user.id)
                    .single()
                if (profile) {
                    const name = [profile.first_name, profile.last_name].filter(Boolean).join(' ')
                    const googleName = user.user_metadata?.name || user.user_metadata?.full_name || user.user_metadata?.given_name || ''
                    const fallback = googleName || user.email || 'Foydalanuvchi'
                    setUserName(name || fallback)
                } else {
                    const googleName = user.user_metadata?.name || user.user_metadata?.full_name || user.user_metadata?.given_name || ''
                    setUserName(googleName || user.email || 'Foydalanuvchi')
                }
            }
        }
        fetchUser()
    }, [])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        window.location.href = '/'
    }

    const userRole = 'Talaba'

    return (
        <>
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
            {/* Backdrop */}
            <div 
                className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={closeMenu}
            />

            {/* Sidebar */}
            <div className={`fixed top-0 left-0 h-full max-h-screen bg-white z-50 w-72 md:w-80 flex flex-col transition-transform duration-300 ease-in-out border-r border-[#DFE5ED] shadow-2xl ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                
                {/* Header inside Sidebar */}
                <div className='flex items-center justify-between p-6 border-b border-[#DFE5ED] bg-slate-50/50'>
                    <Link href={'/dashboard'} onClick={closeMenu}>
                        <Image src={'/assets/logo.png'} alt='logo' width={120} height={40} className='w-28 sm:w-32' />
                    </Link>
                    <button 
                        onClick={closeMenu}
                        className="p-2 cursor-pointer hover:bg-slate-200 rounded-full transition-colors text-slate-500"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Menu Items */}
                <div className='flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar'>
                    {
                        Pages.map((item) => {
                            const isActive = pathname === item.path

                            return (
                                <Link
                                    onClick={closeMenu}
                                    className={`py-3 px-3 sm:px-4 rounded-xl text-[15px] font-medium flex items-center gap-2 sm:gap-3 transition-all ${isActive
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                                        : 'text-slate-600 hover:bg-slate-100'
                                        }`}
                                    href={item.path}
                                    key={item.id}>
                                    <div className={`p-2 rounded-lg ${isActive ? 'bg-white/20' : 'bg-slate-100'}`}>
                                        <Image
                                            src={isActive ? item.iconActive : item.icon}
                                            alt={item.pageName}
                                            width={20}
                                            height={20}
                                            className='w-5 h-5'
                                        />
                                    </div>
                                    <div className="flex items-center justify-between flex-1">
                                        <span>{item.pageName}</span>
                                        {item.soon && (
                                            <span className='px-2.5 py-0.5 bg-linear-to-r from-purple-500 to-indigo-500 text-white rounded-full text-[8px] md:text-[11px] font-bold uppercase tracking-wide shadow-sm shadow-purple-200 animate-pulse'>
                                                tez orada
                                            </span>
                                        )}
                                    </div>
                                </Link>
                            )
                        })
                    }
                </div>

                {/* Profile Section inside Sidebar */}
                <div className='p-4 border-t border-[#DFE5ED] bg-slate-50'>
                    <div className={`p-3 w-full flex items-center rounded-xl transition-all gap-4 ${pathname === "/profile" ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white border border-slate-100'}`}>
                        <Link 
                            href={'/profile'} 
                            onClick={closeMenu}
                            className="flex items-center gap-4 flex-1 min-w-0"
                        >
                            <div className={`w-11 h-11 flex justify-center items-center rounded-full overflow-hidden border-2 ${pathname === "/profile" ? 'border-white/30 bg-white/10' : 'border-slate-100 bg-slate-50'} shrink-0`}>
                                {pathname === "/profile" ? (
                                    <Image src={'/assets/profileActive.png'} alt='profile' width={28} height={28} className='w-7 h-7' />
                                ) : (<Image src={'/assets/profile.png'} alt='profile' width={20} height={20} className='w-5 h-5' />)}
                            </div>
                            <div className='flex flex-col min-w-0'>
                                <h3 className='text-[15px] font-semibold leading-tight truncate'>{userName}</h3>
                                <p className={`text-[12px] ${pathname === "/profile" ? 'text-indigo-100' : 'text-slate-500'}`}>{userRole}</p>
                            </div>
                        </Link>
                        <button
                            onClick={() => setShowLogoutConfirm(true)}
                            className={`p-2 rounded-xl cursor-pointer transition-colors shrink-0 ${pathname === "/profile" ? 'hover:bg-white/20 text-white' : 'hover:bg-red-50 text-red-400'}`}
                            title="Chiqish"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Menu