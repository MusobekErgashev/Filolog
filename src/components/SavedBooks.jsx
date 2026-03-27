'use client'

import Image from 'next/image'
import React from 'react'

const SavedBooks = ({ value }) => {
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
            name: "hello world",
            author: "hello world",
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
    ]

    const filteredData = data.filter((item) => item.name.toLowerCase().includes(value.toLowerCase()))

    return (
        <div className='grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 relative gap-3 lg:gap-5'>
            {
                filteredData.length === 0 ? <p className='text-xl absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-1/2 font-medium'>Kitob topilmadi</p> : filteredData.map((item) => {
                    return (
                        <div key={item.id} className='flex p-3 justify-between h-80 sm:h-110 lg:h-125 xl:h-130 flex-col transition-all hover:shadow-2xl bg-white rounded-2xl shadow-xl shadow-blue-100'>
                            <div className='overflow-hidden rounded-xl'>
                                <Image src={'/assets/book.webp'} className='w-full transition-all hover:scale-105 h-40 sm:h-60 lg:h-75 xl:h-80 object-cover' alt='book' width={100} height={350} />
                            </div>

                            <div className='flex flex-col gap-1'>
                                <h1 className='text-[16px] lg:text-[20px] font-semibold leading-6'>{item.name}</h1>

                                <div className='flex justify-between'>
                                    <h3 className='text-[12px] sm:text-[14px] leading-3 sm:leading-normal lg:text-[16px] font-light text-[#45556C]'>{item.author}</h3>
                                    <div className='flex gap-1 items-center opacity-85'>
                                        <Image className='min-w-3 lg:min-w-4' src={'/assets/download.png'} alt='download' width={0} height={0} />
                                        <p className='text-[12px] sm:text-[14px] lg:text-[14px] font-normal text-[#45556C]'>{item.downloadCount}</p>
                                    </div>
                                </div>

                                <div className='flex flex-col'>
                                    <div className='flex w-full gap-2'>
                                        <button className='transition-all text-[10px] w-full sm:text-[12px] lg:text-[16px] text-orange-500 hover:bg-orange-50 border-2 border-orange-500 rounded-md cursor-pointer font-medium py-1.5 lg:py-2 px-2 lg:px-3 mt-2'>Olib tashlash</button>
                                    </div>
                                    <button className='bg-[#8144FE] text-[10px] sm:text-[12px] lg:text-[16px] transition-all hover:bg-[#9c5fff] text-white rounded-md cursor-pointer font-medium py-1.5 lg:py-2 px-2 lg:px-3 mt-2'>Yuklash</button>
                                </div>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default SavedBooks