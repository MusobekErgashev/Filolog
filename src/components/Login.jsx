'use client'

import React, { use, useState } from 'react'

const Login = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  function formSubmit(e) {
    e.preventDefault()
  }

  return (
    <div>
      <form action="" onSubmit={formSubmit} className='flex flex-col gap-4'>
        <div className="w-full h-11 relative flex rounded-xl">
          <input
            required=""
            className="peer w-full bg-white outline-none px-3 text-[14px] text-[#0F172B] rounded-md border border-[#006EDD]"
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label
            className={`absolute cursor-text ${username ? "" : "top-1/2"} translate-y-[-50%] bg-white left-4 px-1 peer-focus:top-0 peer-focus:left-3 font-light text-base peer-focus:text-sm peer-focus:text-[#006EDD] peer-valid:left-3 peer-valid:text-sm peer-valid:text-[#006EDD] duration-150`}
            htmlFor="username"
          >
            Foydalanuvchi nomi</label>
        </div>
        
        <div className="w-full h-11 relative flex rounded-xl">
          <input
            required=""
            className="peer w-full bg-white outline-none px-3 text-[14px] text-[#0F172B] rounded-md border border-[#006EDD]"
            id="password"
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label
            className={`absolute cursor-text ${password ? "" : "top-1/2"} translate-y-[-50%] bg-white left-4 px-1 peer-focus:top-0 peer-focus:left-3 font-light text-base peer-focus:text-sm peer-focus:text-[#006EDD] peer-valid:left-3 peer-valid:text-sm peer-valid:text-[#006EDD] duration-150`}
            htmlFor="password"
          >
            Parolni kiriting</label>
        </div>

        <p className='text-[#F84800] text-[14px] text-center select-none transition-all'>Login yoki parol xato!</p>

        <button className='w-full h-11 rounded-md cursor-pointer text-white text-[14px] lg:text-[16px] outline-0 transition-all bg-[#006EDD]'>Kirish</button>
      </form>
    </div>
  )
}

export default Login