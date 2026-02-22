import Image from 'next/image'
import React from 'react'

const page = () => {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-[30px] lg:text-[34px] font-semibold leading-9 lg:leading-11">Peshqadamlar Taxtasi</h1>
        <p className="text-[14px] lg:text-[18px] text-[#8144FE]">{`Platformadagi eng aktiv foydalanuvchilar ro'yxati`}</p>
      </div>

      <div className='bg-white w-full flex flex-col gap-2 p-3 rounded-2xl shadow-xl transition-all shadow-gray-200'>
        <div className='flex items-center justify-between border p-2 rounded-md border-[#DFE5ED]'>
          <div className='flex gap-3 items-center'>
            <div className='flex gap-3 items-center'>
              <h1 className='bg-[#8144FE] p-1 rounded-md text-white text-[14px] lg:text-[16px] w-10 h-10 lg:w-11 lg:h-11 flex justify-center items-center font-medium'>#1</h1>
            </div>

            <Image src={'/assets/1st.png'} className='min-w-6 lg:min-w-7' alt='rank' width={0} height={0} />
            <h1 className='font-medium text-[16px] lg:text-[18px] leading-0 text-[#8144FE]'>Musobek Ergashev</h1>
          </div>

          <div>
            <h2 className='text-[#8144FE] text-[14px] lg:text-[16px] font-medium'>Olmoslar: 1200</h2>
          </div>
        </div>
        
        <div className='flex items-center justify-between border p-2 rounded-md border-[#DFE5ED]'>
          <div className='flex gap-3 items-center'>
            <div className='flex gap-3 items-center'>
              <h1 className='bg-[#8144FE] p-1 rounded-md text-white text-[14px] lg:text-[16px] w-10 h-10 lg:w-11 lg:h-11 flex justify-center items-center font-medium'>#2</h1>
            </div>

            <Image src={'/assets/2nd.png'} className='min-w-6 lg:min-w-7' alt='rank' width={0} height={0} />
            <h1 className='font-medium text-[16px] lg:text-[18px] leading-0 text-[#8144FE]'>Musobek Ergashev</h1>
          </div>

          <div>
            <h2 className='text-[#8144FE] text-[14px] lg:text-[16px] font-medium'>Olmoslar: 1200</h2>
          </div>
        </div>
        
        <div className='flex items-center justify-between border p-2 rounded-md border-[#DFE5ED]'>
          <div className='flex gap-3 items-center'>
            <div className='flex gap-3 items-center'>
              <h1 className='bg-[#8144FE] p-1 rounded-md text-white text-[14px] lg:text-[16px] w-10 h-10 lg:w-11 lg:h-11 flex justify-center items-center font-medium'>#3</h1>
            </div>

            <Image src={'/assets/3nd.png'} className='min-w-6 lg:min-w-7' alt='rank' width={0} height={0} />
            <h1 className='font-medium text-[16px] lg:text-[18px] leading-0 text-[#8144FE]'>Musobek Ergashev</h1>
          </div>

          <div>
            <h2 className='text-[#8144FE] text-[14px] lg:text-[16px] font-medium'>Olmoslar: 1200</h2>
          </div>
        </div>
      </div>
    </div>
  )
}

export default page