'use client'

import Link from 'next/link'
import React from 'react'
import { Pages } from '@/app/pages-export'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import useMenuStore from '@/store/menuStore'
import { X } from 'lucide-react'

const Menu = () => {
    const pathname = usePathname()
    const { isOpen, closeMenu } = useMenuStore()

    return (
        <>
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
                                    className={`py-3 px-4 rounded-xl text-[15px] font-medium flex items-center gap-3 transition-all ${isActive
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

                                    <span>{item.pageName}</span>
                                </Link>
                            )
                        })
                    }
                </div>

                {/* Profile Section inside Sidebar */}
                <div className='p-4 border-t border-[#DFE5ED] bg-slate-50'>
                    <Link 
                        href={'/profile'} 
                        onClick={closeMenu}
                        className={`p-3 w-full flex items-center rounded-xl transition-all gap-4 ${pathname === "/profile" ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'hover:bg-slate-200 bg-white border border-slate-100'}`}
                    >
                        <div className={`w-11 h-11 flex justify-center items-center rounded-full overflow-hidden border-2 ${pathname === "/profile" ? 'border-white/30 bg-white/10' : 'border-slate-100 bg-slate-50'}`}>
                             {
                                pathname === "/profile" ? (
                                    <Image src={'/assets/profileActive.png'} alt='profile' width={28} height={28} className='w-7 h-7' />
                                ) : (<Image src={'/assets/profile.png'} alt='profile' width={20} height={20} className='w-5 h-5' />)
                            }
                        </div>
                        <div className='flex flex-col'>
                            <h3 className='text-[15px] font-semibold leading-tight'>Musobek</h3>
                            <p className={`text-[12px] ${pathname === "/profile" ? 'text-indigo-100' : 'text-slate-500'}`}>Talaba</p>
                        </div>
                    </Link>
                </div>
            </div>
        </>
    )
}

export default Menu