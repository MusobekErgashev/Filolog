import Image from 'next/image'
import React from 'react'

const page = () => {
  const data = [
    {
      id: 1,
      title: "Barcha testlar",
      value: 24,
      icon: "/assets/allTests.png",
      color: "bg-[#0097F6]",
    },
    {
      id: 2,
      title: "Yechilgan testlar",
      value: 8,
      icon: "/assets/completedTests.png",
      color: "bg-[#00AF5F]",
    },
  ]

  return (
    <div className='flex flex-col gap-5'>
      <div>
        <h1 className="text-[26px] sm:text-[30px] lg:text-[34px] font-semibold leading-7 sm:leading-9 lg:leading-11">{"Testlar bo'limi"}</h1>
        <p className="text-[14px] lg:text-[18px] text-[#8144FE]">{"Test yechib bilimingizni oshiring va bonus ballarni qo'lga kiriting"}</p>
      </div>

      <div className='flex flex-col sm:flex-row gap-2 w-full'>
        {
          data.map((item) => {
            return (
              <div key={item.id} className='flex justify-between w-full bg-white p-6 rounded-2xl shadow-xl transition-all hover:shadow-2xl shadow-gray-200'>
                <div className='flex flex-col justify-between'>
                  <h2 className='text-[16px] lg:text-[20px] font-medium'>{item.title}</h2>
                  <h1 className='text-[14px] lg:text-[16px]'>{item.value} ta</h1>
                </div>
                <div className={`${item.color} p-2.5 w-max h-max rounded-2xl`}>
                  <Image src={item.icon} alt='icon' width={0} height={0} className='min-w-7 min-h-7 lg:min-w-8 lg:min-h-8' />
                </div>
              </div>
            )
          })
        }
      </div>

      <div className='flex flex-col gap-3 w-full'>
        <div className='bg-white flex flex-col cursor-pointer hover:bg-gray-50 border-2 border-white gap-2 p-6 rounded-2xl shadow-xl transition-all hover:shadow-2xl shadow-gray-200'>
          <div className='flex gap-2 items-center'>
            <h1 className='font-semibold text-[18px] lg:text-[22px] leading-5.5'>Victorian Poetry Analysis</h1>
            <span className='text-[10px] lg:text-[14px] font-normal px-1 h-max bg-green-400'>Tugatilgan</span>
          </div>

          <p className='text-[13px] lg:text-[16px] font-light'>Analyze poems by Tennyson and Browning</p>

          <div className='flex mt-1 lg:mt-1.5 gap-3 items-center'>
            <div className='flex items-center gap-1.5 font-light text-[#45556C]'>
              <Image src={'/assets/quiz-question-count.png'} alt='' className='min-w-4 lg:min-w-5' width={0} height={0} />
              <p className='text-[13px] lg:text-[16px]'>10 ta savollar</p>
            </div>
            <div className='flex items-center gap-1.5 font-light text-[#45556C]'>
              <Image src={'/assets/quiz-question-time.png'} alt='' className='min-w-4 lg:min-w-5' width={0} height={0} />
              <p className='text-[13px] lg:text-[16px]'>20 daqiqa</p>
            </div>
          </div>

          <div className='w-full flex gap-3 items-center'>
            <div className='w-full rounded bg-gray-200'>
              <div className='w-[87%] bg-black h-1 lg:h-2 rounded'></div>
            </div>

            <h1 className='w-max text-[12px] lg:text-[16px] font-medium'>87%</h1>
          </div>
        </div>
      </div>
    </div>
  )
}

export default page