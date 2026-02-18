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
      name: "The Great Gatsby df asdf  asd fad f",
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
        <h1 className="text-[34px] font-semibold">Raqamli Kutubxona</h1>
        <p className="text-[18px] text-[#8144FE]">{"O'zingizga kerakli PDF kitobni tanlang va yuklab oling"}</p>
      </div>

      <div className='flex justify-between items-center gap-2'>
        <form className='w-full flex border-[#DFE5ED] border-2 items-center rounded-md px-2 gap-2 py-2 bg-white shadow-xl shadow-blue-100'>
          <Image src={'/assets/search.png'} alt='search' width={20} height={20} className='min-w-5 h-max' />
          <input type='text' placeholder='kitob qidirish...' className='w-full outline-0' />
        </form>

        <div className='flex items-center py-2 px-2 rounded-md shadow-xl bg-orange-500 cursor-pointer shadow-blue-100 gap-1'>
          <Image src={'/assets/star.png'} alt='filter' width={20} height={20} className='min-w-6' />

          <h1 className='text-white'>Saralanganlar</h1>
        </div>
      </div>

      <div className='grid grid-cols-4 gap-5'>
        {
          data.map((item) => {
            return (
              <div key={item.id} className='flex justify-between h-128 flex-col transition-all hover:shadow-2xl bg-white rounded-2xl shadow-xl shadow-blue-100'>
                <div className='overflow-hidden rounded-t-2xl'>
                  <Image src={'/assets/book.webp'} className='w-full transition-all hover:scale-110 h-75 object-cover' alt='book' width={100} height={350} />
                </div>

                <div className='p-3 flex flex-col gap-1'>
                  <h1 className='text-[20px] font-semibold leading-6'>{item.name}</h1>

                  <div className='flex justify-between'>
                    <h3 className='text-[16px] font-light text-[#45556C]'>{item.author}</h3>
                    <div className='flex gap-1 items-center opacity-85'>
                      <Image className='min-w-4' src={'/assets/download.png'} alt='download' width={10} height={10} />
                      <p className='text-[14px] font-normal text-[#45556C]'>{item.downloadCount}</p>
                    </div>
                  </div>

                  <div className='flex flex-col'>
                    <button className='transition-all text-orange-500 border-2 border-orange-500 rounded-md cursor-pointer font-medium py-2 px-3 mt-2'>Saralanganlarga</button>
                    <button className='bg-[#8144FE] transition-all hover:bg-[#9c5fff] text-white rounded-md cursor-pointer font-medium py-2 px-3 mt-2'>Yuklash</button>
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