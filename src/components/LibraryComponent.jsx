'use client'

import BookCards from './BookCards';
import SavedBooks from './SavedBooks';
import Image from 'next/image';
import { useState } from 'react';

const LibraryComponent = () => {
    const [isSavedBooksComponent, setIsSavedBooksComponent] = useState(false);
    const [inputValue, setInputValue] = useState("");

    return (
        <div className='flex flex-col gap-5'>
            <div className='flex justify-between items-center gap-2'>
                <form onSubmit={(e) => e.preventDefault()} className='w-full flex border-[#DFE5ED] border-2 items-center rounded-md px-2 gap-2 py-2 bg-white shadow-xl shadow-blue-100'>
                    <Image src={'/assets/search.png'} alt='search' width={0} height={0} className='w-4 lg:w-5 h-max' />
                    <input value={inputValue} onChange={(e) => setInputValue(e.target.value)} type='text' placeholder='kitob qidirish...' className='w-full text-[14px] lg:text-[16px] outline-0' />
                </form>

                <div onClick={() => {
                    setIsSavedBooksComponent(!isSavedBooksComponent);
                }} className='flex items-center py-2 px-2 rounded-md shadow-xl bg-orange-500 cursor-pointer shadow-blue-100 gap-1'>
                    <Image src={isSavedBooksComponent ? '/assets/back.png' : '/assets/star.png'} alt='filter' width={0} height={0} className='min-w-4 lg:min-w-5 h-max' />

                    <h1 className='text-white text-[14px] lg:text-[16px]'>{isSavedBooksComponent ? 'Ortga' : 'Saralanganlar'}</h1>
                </div>
            </div>

            {isSavedBooksComponent ? <SavedBooks value={inputValue} /> : <BookCards value={inputValue} />}
        </div>
    )
}

export default LibraryComponent