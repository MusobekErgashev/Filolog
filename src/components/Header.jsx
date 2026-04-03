'use client'

import React from 'react'
import { MenuIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import useMenuStore from '@/store/menuStore'

const Header = () => {
    const { toggleMenu } = useMenuStore()

    return (
        <div className='w-full px-5 py-2 sm:py-3 flex justify-between items-center bg-white border-b border-[#DFE5ED]'>
            <div className='flex items-center gap-4'>
                <MenuIcon 
                    className='w-7 h-7 text-indigo-600 cursor-pointer hover:bg-slate-50 rounded-md transition-colors' 
                    onClick={toggleMenu}
                />

                <Link href={'/'}>
                    <Image src={'/assets/logo.png'} alt='logo' width={140} height={50} className='min-w-25 w-25 sm:min-w-28 md:min-w-32 md:w-32 lg:w-35' />
                </Link>
            </div>

            <div className='flex gap-2.5 sm:gap-5 items-center  rounded px-3 py-1'>
                <Link href={'/liderboard'} className='flex gap-2 items-center'>
                    <Image src={'/assets/rank.png'} alt='olmos' width={0} height={0} className='min-w-4 sm:min-w-5 min-h-4 sm:min-h-5 lg:min-w-6 lg:min-h-6' />
                    <h2 className='text-[#CA1717] font-medium text-[14px] lg:text-[16px]'><span className='hidden sm:inline-block'>Reyting</span> {"8-o'rin"}</h2>
                </Link>

                <Link href={'/liderboard'} className='flex gap-2 items-center'>
                    <Image src={'/assets/diamond.png'} alt='olmos' width={0} height={0} className='min-w-4 sm:min-w-5 min-h-4 sm:min-h-5 lg:min-w-6 lg:min-h-6' />
                    <h2 className='text-[#8144FE] font-medium text-[14px] lg:text-[16px]'><span className='hidden sm:inline-block'>Olmoslar</span> 1200 ta</h2>
                </Link>
            </div>
        </div>
    )
}

export default Header