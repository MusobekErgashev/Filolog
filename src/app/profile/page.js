import Image from 'next/image'
import React from 'react'

const page = () => {
  return (
    <div className="flex flex-col gap-5">
      <div className='bg-[#8144FE] p-6 flex justify-between rounded-2xl shadow-xl transition-all shadow-gray-200'>
        <div>
          <h1 className="text-[28px] lg:text-[34px] text-white font-semibold leading-9 lg:leading-10">Musobek Ergashev</h1>
          <p className='text-[14px] lg:text-[16px] text-white font-medium'>+998-93-235-87-33</p>
        </div>

        <div className='flex gap-2 items-center'>
          <div className='border-2 h-max cursor-pointer flex items-center gap-1 px-1.5 py-0.5 rounded border-white'>
            <Image src={'/assets/edit-profile.png'} className='h-5 lg:h-6 w-max' alt='tahrirlash' width={0} height={0} />
            <h2 className='text-white text-[14px] lg:text-[18px] font-medium'>tahrirlash</h2>
          </div>
          <div className='border-2 h-max cursor-pointer flex items-center gap-1 px-1.5 py-0.5 rounded border-white'>
            <Image src={'/assets/logout-profile.png'} className='h-5 lg:h-6 w-max' alt='tahrirlash' width={0} height={0} />
            <h2 className='text-white text-[14px] lg:text-[18px] font-medium'>chiqish</h2>
          </div>
        </div>
      </div>
    </div>
  )
}

export default page