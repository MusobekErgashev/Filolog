'use client'

import Login from '@/components/Login'
import Register from '@/components/Register'
import Image from 'next/image'
import React, { useState } from 'react'

const Auth = () => {
    const [state, setState] = useState(true)

    return (
        <div className='w-full text-[#0F172B] h-screen bg-[url(/assets/authBack.jpg)] bg-white flex justify-center items-center fixed top-0 left-0'>
            <div className='w-max rounded-2xl flex h-max bg-white shadow-2xl shadow-[#006fdd91]'>
                <div className='w-85 hidden lg:w-100 bg-[#006EDD] rounded-l-2xl md:flex justify-center items-center'>
                    <Image src={state ? "/assets/login.jpeg" : "/assets/register.jpeg"} alt='' width={300} height={300} className="w-full rounded-2xl" />
                </div>

                <div className='w-85 lg:w-100 p-3 border-2 border-[#006EDD] rounded-2xl md:rounded-none md:rounded-r-2xl'>
                    <Image src={'/assets/logo.png'} alt='logo' width={150} height={60} className='w-38 my-8 mx-auto' />

                    <div className='w-full rounded-full flex justify-between border-b-2 mb-6 border-b-[#006EDD]'>
                        <h1 className={`w-full cursor-pointer flex select-none rounded-l-full leading-4 justify-center text-[14px] lg:text-[16px] font-medium py-3 ${state ? "bg-[#006EDD] text-white" : "text-[#006EDD]"}`} onClick={() => setState(true)}>Kirish</h1>
                        <h1 className={`w-full cursor-pointer flex select-none rounded-r-full leading-4 justify-center text-[14px] lg:text-[16px] border-l-2 border-l-[#006EDD] py-3 font-medium ${!state ? "bg-[#006EDD] text-white" : "text-[#006EDD]"}`} onClick={() => setState(false)}>{`Ro'yxatdan o'tish`}</h1>
                    </div>


                    <div className='mb-5'>
                        {
                            state ? <Login /> : <Register />
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Auth