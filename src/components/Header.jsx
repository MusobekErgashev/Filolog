'use client'

import Image from 'next/image'
import React from 'react'

const Header = () => {
    return (
        <div className='w-full px-10 py-4 flex justify-between items-center bg-white border-b border-[#DFE5ED]'>
            <h1>Logo</h1>

            <div className='flex gap-5 items-center bg-[#F5F8FB] rounded px-3 py-1'>
                <div className='flex gap-2 items-center'>
                    <Image src={'/assets/rank.png'} alt='olmos' width={24} height={24} />
                    <h2 className='text-[#CA1717] font-medium text-[16px] cursor-pointer'>{"Reyting 8-o'rin"}</h2>
                </div>

                <div className='flex gap-2 items-center'>
                    <Image src={'/assets/diamond.png'} alt='olmos' width={24} height={24} />
                    <h2 className='text-[#8144FE] font-medium text-[16px] cursor-pointer'>Olmoslar 1200 ta</h2>
                </div>
            </div>
        </div>
    )
}

export default Header