import Image from 'next/image'
import React from 'react'

const page = () => {
  const data = [
    {
      id: 1,
      name: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      isFavourite: false,
      downloadCount: 12
    },
    {
      id: 2,
      name: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      isFavourite: false,
      downloadCount: 223
    },
    {
      id: 3,
      name: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      isFavourite: false,
      downloadCount: 11
    },
    {
      id: 4,
      name: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      isFavourite: true,
      downloadCount: 3
    },
    {
      id: 5,
      name: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      isFavourite: false,
      downloadCount: 0
    },
    {
      id: 6,
      name: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      isFavourite: true,
      downloadCount: 54
    },
  ]

  return (
    <div className='flex flex-col gap-5'>
      <div>
        <h1 className="text-[26px] sm:text-[30px] lg:text-[34px] font-semibold leading-7 sm:leading-9 lg:leading-11">Raqamli Kutubxona</h1>
        <p className="text-[14px] lg:text-[18px] text-[#8144FE]">{"O'zingizga kerakli PDF kitobni tanlang va yuklab oling"}</p>
      </div>

      <div className='flex justify-between items-center gap-2'>
        <form className='w-full flex border-[#DFE5ED] border-2 items-center rounded-md px-2 gap-2 py-2 bg-white shadow-xl shadow-blue-100'>
          <Image src={'/assets/search.png'} alt='search' width={0} height={0} className='w-4 lg:w-5 h-max' />
          <input type='text' placeholder='kitob qidirish...' className='w-full text-[14px] lg:text-[16px] outline-0' />
        </form>

        <div className='flex items-center py-2 px-2 rounded-md shadow-xl bg-orange-500 cursor-pointer shadow-blue-100 gap-1'>
          <Image src={'/assets/star.png'} alt='filter' width={0} height={0} className='min-w-4 lg:min-w-5 h-max' />

          <h1 className='text-white text-[14px] lg:text-[16px]'>Saralanganlar</h1>
        </div>
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-5'>
        {
          data.map((item) => {
            return (
              <div key={item.id} className='flex justify-between h-90 sm:h-110 lg:h-125 flex-col transition-all hover:shadow-2xl bg-white rounded-2xl shadow-xl shadow-blue-100'>
                <div className='overflow-hidden rounded-t-2xl'>
                  <Image src={'/assets/book.webp'} className='w-full transition-all hover:scale-105 h-40 sm:h-60 lg:h-75 object-cover' alt='book' width={100} height={350} />
                </div>

                <div className='p-3 flex flex-col gap-1'>
                  <h1 className='text-[16px] lg:text-[20px] font-semibold leading-6'>{item.name}</h1>

                  <div className='flex justify-between'>
                    <h3 className='text-[14px] lg:text-[16px] font-light text-[#45556C]'>{item.author}</h3>
                    <div className='flex gap-1 items-center opacity-85'>
                      <Image className='min-w-3 lg:min-w-4' src={'/assets/download.png'} alt='download' width={0} height={0} />
                      <p className='text-[12px] lg:text-[14px] font-normal text-[#45556C]'>{item.downloadCount}</p>
                    </div>
                  </div>

                  <div className='flex flex-col'>
                    <button className='transition-all text-[10px] sm:text-[12px] lg:text-[16px] text-orange-500 border-2 border-orange-500 rounded-md cursor-pointer font-medium py-1.5 lg:py-2 px-2 lg:px-3 mt-2'>Saralanganlarga</button>
                    <button className='bg-[#8144FE] text-[10px] sm:text-[12px] lg:text-[16px] transition-all hover:bg-[#9c5fff] text-white rounded-md cursor-pointer font-medium py-1.5 lg:py-2 px-2 lg:px-3 mt-2'>Yuklash</button>
                  </div>
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default page