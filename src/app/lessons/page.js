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
        <h1 className="text-[30px] lg:text-[34px] font-semibold leading-9 lg:leading-11">Barcha Darsliklar {data.length} ta</h1>
        <p className="text-[14px] lg:text-[18px] text-[#8144FE]">Ona tili va Adabiyot fanidan professional tarzda tuzilgan videodarsliklar</p>
      </div>

      <div className='flex justify-between items-center gap-2'>
        <form className='w-full flex border-[#DFE5ED] border-2 items-center rounded-md px-2 gap-1 lg:gap-2 py-2 bg-white shadow-xl shadow-blue-100'>
          <Image src={'/assets/search.png'} alt='search' width={0} height={0} className='w-4 lg:w-5 h-max' />
          <input type='text' placeholder='darsliklardan qidirish...' className='w-full text-[14px] lg:text-[16px] outline-0' />
        </form>

        <div className='flex items-center bg-white py-2 px-2 rounded-md shadow-xl border-2 shadow-blue-100 border-[#DFE5ED]'>
          <Image src={'/assets/filter.png'} alt='filter' width={0} height={0} className='w-5 lg:w-6' />
          
          <select className='outline-0 cursor-pointer text-[14px] lg:text-[16px] w-full'>
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
                  <h1 className='bg-[#8144FE] p-1 rounded-md text-white w-10 h-10 text-[14px] lg:text-[16px] lg:w-11 lg:h-11 flex justify-center items-center font-medium'>#{item.id}</h1>
                  <p className='text-[#8144FE] font-medium text-[14px] lg:text-[16px]'>{item.title}</p>
                </div>

                <div className='flex gap-4'>
                  <h3 className='text-[#00AF5F] text-[14px] lg:text-[16px]'>{item.isEnded ? "Tugatilgan" : ""}</h3>
                  <h2 className='text-[#8144FE] text-[14px] lg:text-[16px]'>23:09</h2>
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