import Image from 'next/image'
import React from 'react'

const page = () => {
  const data = [
    {
      id: 1,
      title: "Ot, sifat, son, fe'l",
      video: "link here",
      isEnded: true,
    },
    {
      id: 2,
      title: "Ot, sifat, son, fe'l",
      video: "link here",
      isEnded: true,
    },
    {
      id: 3,
      title: "Ot, sifat, son, fe'l",
      video: "link here",
      isEnded: false,
    },
    {
      id: 4,
      title: "Ot, sifat, son, fe'l",
      video: "link here",
      isEnded: false,
    },
  ]

  return (
    <div className='flex flex-col gap-5'>
      <div>
        <h1 className="text-[34px] font-semibold">Barcha Darsliklar {data.length} ta</h1>
        <p className="text-[18px] text-[#8144FE]">Ona tili va Adabiyot fanidan professional tarzda tuzilgan videodarsliklar</p>
      </div>

      <div className='flex justify-between items-center gap-2'>
        <form className='w-full flex border-[#DFE5ED] border-2 items-center rounded-md px-2 gap-2 py-2 bg-white shadow-xl shadow-blue-100'>
          <Image src={'/assets/search.png'} alt='search' width={20} height={20} className='min-w-5 h-max' />
          <input type='text' placeholder='darsliklardan qidirish...' className='w-full outline-0' />
        </form>

        <div className='flex items-center bg-white py-2 px-2 rounded-md shadow-xl border-2 shadow-blue-100 border-[#DFE5ED]'>
          <Image src={'/assets/filter.png'} alt='filter' width={20} height={20} className='min-w-6' />
          
          <select className='outline-0 cursor-pointer'>
            <option className='bg-[#8144FE] text-white' value={"barchasi"}>
              Barchasi
            </option>
            <option className='bg-[#00AF5F] text-white' value={"tugatilgan"}>
              Tugatilgan
            </option>
            <option className='bg-[#F84800] text-white' value={"tugatilmagan"}>
              Tugatilmagan
            </option>
          </select>
        </div>
      </div>

      <div className='flex flex-col gap-2'>
        {
          data.map((item) => {
            return (
              <div key={item.id} className='flex cursor-pointer transition-all hover:bg-gray-100 justify-between px-2 py-2 bg-white rounded-md items-center shadow-xl shadow-blue-100'>
                <div className='flex gap-3 items-center'>
                  <h1 className='bg-[#8144FE] p-1 rounded-md text-white w-11 h-11 flex justify-center items-center font-medium'>#{item.id}</h1>
                  <p className='text-[#8144FE] font-medium text-[16px]'>{item.title}</p>
                </div>

                <div className='flex gap-4'>
                  <h3 className='text-[#00AF5F]'>{item.isEnded ? "Tugatilgan" : ""}</h3>
                  <h2 className='text-[#8144FE]'>23:09</h2>
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