'use client'

import Link from 'next/link'
import React, { useState } from 'react'
import { Pages } from '@/app/pages-export'

const Menu = () => {
  const [linkId, setLinkId] = useState(null)

  return (
    <div className='bg-white w-80 px-10 flex flex-col justify-between py-5 border-r border-[#DFE5ED]'>
        <div className='flex flex-col gap-1'>
            {
                Pages.map((item) => {
                    return(
                        <Link className={`py-3 px-5 bg-[#8144FE] rounded-xl text-white font-medium ${}`}
                            key={item.id}
                            href={item.path}>
                            {item.pageName}
                        </Link>
                    )
                })
            }
        </div>
        <div></div>
    </div>
  )
}

export default Menu