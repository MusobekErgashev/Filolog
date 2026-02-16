'use client'

import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Header = () => {
    return (
        <div className='w-full px-5 py-3 flex justify-between items-center bg-white border-b border-[#DFE5ED]'>
            <Link href={'/'}>
                <Image src={'/assets/logo.png'} alt='logo' width={140} height={50} className='min-w-30' />
            </Link>

            <div className='flex gap-5 items-center  rounded px-3 py-1'>
                <Link href={'/liderboard'} className='flex gap-2 items-center'>
                    <Image src={'/assets/rank.png'} alt='olmos' width={24} height={24} />
                    <h2 className='text-[#CA1717] font-medium text-[16px]'>{"Reyting 8-o'rin"}</h2>
                </Link>

                <Link href={'/liderboard'} className='flex gap-2 items-center'>
                    <Image src={'/assets/diamond.png'} alt='olmos' width={24} height={24} />
                    <h2 className='text-[#8144FE] font-medium text-[16px]'>Olmoslar 1200 ta</h2>
                </Link>
            </div>
        </div>
    )
}

export default Header