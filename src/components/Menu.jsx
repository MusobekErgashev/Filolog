'use client'

import Link from 'next/link'
import React, { useState } from 'react'
import { Pages } from '@/app/pages-export'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

const Menu = () => {
    const pathname = usePathname()

    return (
        <div className='bg-white w-full gap-1 justify-between sm:w-max md:w-60 lg:w-80 flex sm:flex-col transition-all sm:justify-between py-2 sm:py-5 border-r border-[#DFE5ED]'>
            <div className='flex justify-between w-full sm:flex-col px-3 lg:px-5'>
                {
                    Pages.map((item) => {
                        const isActive = pathname === item.path

                        return (
                            <Link
                                className={`p-2 sm:py-3 sm:px-4 rounded-xl h-max text-[14px] lg:text-[16px] font-medium flex items-center gap-2.5 transition-all ${isActive
                                    ? 'bg-[#8144FE] text-white shadow-lg shadow-blue-100'
                                    : 'text-[#45556C] hover:bg-gray-100'
                                    }`}
                                href={item.path}
                                key={item.id}>
                                <Image
                                    src={isActive ? item.iconActive : item.icon}
                                    alt={item.pageName}
                                    width={0}
                                    height={0}
                                    className='min-w-5 min-h-5 lg:w-6 lg:h-6'
                                />

                                <p className='hidden md:block'>{item.pageName}</p>
                            </Link>

                        )
                    })
                }

                <Link href={'/profile'} className={`sm:hidden md:px-4 md:w-full md:py-3 items-center flex rounded-xl transition-all gap-3 lg:gap-4 ${pathname === "/profile" ? 'bg-[#8144FE] shadow-lg shadow-blue-100' : 'md:bg-[#F3F7FA] md:hover:bg-gray-200'}`}>
                    <div className={`p-2 sm:py-3 sm:px-4 sm:w-11 lg:w-12 sm:h-11 lg:h-12 flex justify-center items-center rounded-full ${pathname === "/profile" ? '' : 'bg-white'}`}>
                        {
                            pathname === "/profile" ? (
                                <Image src={'/assets/profileActive.png'} alt='profile' width={0} height={0} className='min-w-5 min-h-5 md:min-w-8 md:min-h-8' />
                            ) : (<Image src={'/assets/profile.png'} alt='profile' width={0} height={0} className='min-w-5 min-h-5' />)
                        }
                    </div>
                    <div className={`hidden md:flex flex-col gap-3.5 lg:gap-4.5 ${pathname === "/profile" ? 'text-white' : ''}`}>
                        <h3 className='text-[14px] lg:text-[16px] font-medium  leading-0'>Musobek</h3>
                        <p className='font-light text-[10px] lg:text-[14px] leading-0'>Yangi</p>
                    </div>
                </Link>
            </div>

            <div className='sm:pt-5 hidden sm:border-t sm:flex justify-center md:justify-start border-[#DFE5ED] pr-3 sm:px-3 lg:px-5'>
                <Link href={'/profile'} className={`md:px-4 md:w-full md:py-3 items-center flex rounded-xl transition-all gap-3 lg:gap-4 ${pathname === "/profile" ? 'bg-[#8144FE] shadow-lg shadow-blue-100' : 'md:bg-[#F3F7FA] md:hover:bg-gray-200'}`}>
                    <div className={`p-2 sm:py-3 sm:px-4 sm:w-11 lg:w-12 sm:h-11 lg:h-12 flex justify-center items-center rounded-full ${pathname === "/profile" ? '' : 'bg-white'}`}>
                        {
                            pathname === "/profile" ? (
                                <Image src={'/assets/profileActive.png'} alt='profile' width={0} height={0} className='min-w-5 min-h-5 md:min-w-8 md:min-h-8' />
                            ) : (<Image src={'/assets/profile.png'} alt='profile' width={0} height={0} className='min-w-5 min-h-5' />)
                        }
                    </div>
                    <div className={`hidden md:flex flex-col gap-3.5 lg:gap-4.5 ${pathname === "/profile" ? 'text-white' : ''}`}>
                        <h3 className='text-[14px] lg:text-[16px] font-medium  leading-0'>Musobek</h3>
                        <p className='font-light text-[10px] lg:text-[14px] leading-0'>Yangi</p>
                    </div>
                </Link>
            </div>
        </div >
    )
}

export default Menu