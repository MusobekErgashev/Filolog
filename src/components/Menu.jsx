'use client'

import Link from 'next/link'
import React, { useState } from 'react'
import { Pages } from '@/app/pages-export'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

const Menu = () => {
    const pathname = usePathname()

    return (
        <div className='bg-white w-60 lg:w-80 flex flex-col transition-all justify-between py-5 border-r border-[#DFE5ED]'>
            <div className='flex flex-col gap-1 px-3 lg:px-5'>
                {
                    Pages.map((item) => {
                        const isActive = pathname === item.path

                        return (
                            <Link
                                className={`py-3 px-4 rounded-xl text-[14px] lg:text-[16px] font-medium flex items-center gap-2.5 transition-all ${isActive
                                    ? 'bg-[#8144FE] text-white shadow-lg shadow-blue-100'
                                    : 'text-[#45556C] hover:bg-gray-100'
                                    }`}
                                key={item.id}
                                href={item.path}>

                                <Image
                                    src={isActive ? item.iconActive : item.icon}
                                    alt={item.pageName}
                                    width={0}
                                    height={0}
                                    className='w-5 h-5 lg:w-6 lg:h-6'
                                />

                                {item.pageName}
                            </Link>
                        )
                    })
                }
            </div>

            <div className='pt-5 border-t border-[#DFE5ED] px-3 lg:px-5'>
                <Link href={'/profile'} className={`px-4 py-3 items-center flex rounded-xl transition-all gap-3 lg:gap-4 ${pathname === "/profile" ? 'bg-[#8144FE] shadow-lg shadow-blue-100' : 'bg-[#F3F7FA] hover:bg-gray-200'}`}>
                    {/* <Image src="" /> */}
                    <div className={`w-11 lg:w-12 h-11 lg:h-12 rounded-full ${pathname === "/profile" ? 'bg-white' : 'bg-[#8144FE]'}`}></div>
                    <div className={`flex flex-col gap-3.5 lg:gap-4.5 ${pathname === "/profile" ? 'text-white' : ''}`}>
                        <h3 className='text-[14px] lg:text-[16px] font-medium  leading-0'>Musobek</h3>
                        <p className='font-light text-[10px] lg:text-[14px] leading-0'>Yangi</p>
                    </div>
                </Link>
            </div>
        </div>
    )
}

export default Menu