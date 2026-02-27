'use client'

import Image from 'next/image'
import React, { useReducer } from 'react'

const initialState = {
  username: "",
  password: "",
  confirmPassword: "",
  name: "",
  surName: ""
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value }
    case 'RESET':
      return initialState
    default:
      return state
  }
}

const Register = () => {
  const [state, dispatch] = useReducer(reducer, initialState)

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
            id="name"
            type="text"
            value={state.name}
            onChange={e =>
              dispatch({ type: 'SET_FIELD', field: 'name', value: e.target.value })
            }
          />
          <label
            className={`absolute cursor-text ${state.name ? "" : "top-1/2"} translate-y-[-50%] bg-white left-4 px-1 peer-focus:top-0 peer-focus:left-3 font-light text-base peer-focus:text-sm peer-focus:text-[#006EDD] peer-valid:left-3 peer-valid:text-sm peer-valid:text-[#006EDD] duration-150`}
            htmlFor="name"
          >
            Ism
          </label>
        </div>

        <div className="w-full h-11 relative flex rounded-xl">
          <input
            required=""
            className="peer w-full bg-white outline-none px-3 text-[14px] text-[#0F172B] rounded-md border border-[#006EDD]"
            id="surname"
            type="text"
            value={state.surName}
            onChange={e =>
              dispatch({ type: 'SET_FIELD', field: 'surName', value: e.target.value })
            }
          />
          <label
            className={`absolute cursor-text ${state.surName ? "" : "top-1/2"} translate-y-[-50%] bg-white left-4 px-1 peer-focus:top-0 peer-focus:left-3 font-light text-base peer-focus:text-sm peer-focus:text-[#006EDD] peer-valid:left-3 peer-valid:text-sm peer-valid:text-[#006EDD] duration-150`}
            htmlFor="surname"
          >
            Familiya
          </label>
        </div>

        <div className="w-full h-11 relative flex rounded-xl">
          <input
            required=""
            className="peer w-full bg-white outline-none px-3 text-[14px] text-[#0F172B] rounded-md border border-[#006EDD]"
            id="username"
            type="text"
            value={state.username}
            onChange={e =>
              dispatch({ type: 'SET_FIELD', field: 'username', value: e.target.value })
            }
          />
          <label
            className={`absolute cursor-text ${state.username ? "" : "top-1/2"} translate-y-[-50%] bg-white left-4 px-1 peer-focus:top-0 peer-focus:left-3 font-light text-base peer-focus:text-sm peer-focus:text-[#006EDD] peer-valid:left-3 peer-valid:text-sm peer-valid:text-[#006EDD] duration-150`}
            htmlFor="username"
          >
            Foydalanuvchi nomi
          </label>
        </div>

        <div className="w-full h-11 relative flex gap-2 rounded-xl">
          <input
            required=""
            className="peer w-full bg-white outline-none px-3 text-[14px] text-[#0F172B] rounded-md border border-[#006EDD]"
            id="password"
            type="text"
            value={state.password}
            onChange={e =>
              dispatch({ type: 'SET_FIELD', field: 'password', value: e.target.value })
            }
          />
          <label
            className={`absolute cursor-text ${state.password ? "" : "top-1/2"} translate-y-[-50%] bg-white left-4 px-1 peer-focus:top-0 peer-focus:left-3 font-light text-base peer-focus:text-sm peer-focus:text-[#006EDD] peer-valid:left-3 peer-valid:text-sm peer-valid:text-[#006EDD] duration-150`}
            htmlFor="password"
          >
            Parolni kiriting
          </label>
        </div>

        <div className="w-full h-11 relative flex rounded-xl">
          <input
            required=""
            className="peer w-full bg-white outline-none px-3 text-[14px] text-[#0F172B] rounded-md border border-[#006EDD]"
            id="confirmpassword"
            type="text"
            value={state.confirmPassword}
            onChange={e =>
              dispatch({ type: 'SET_FIELD', field: 'confirmPassword', value: e.target.value })
            }
          />
          <label
            className={`absolute cursor-text ${state.confirmPassword ? "" : "top-1/2"} translate-y-[-50%] bg-white left-4 px-1 peer-focus:top-0 peer-focus:left-3 font-light text-base peer-focus:text-sm peer-focus:text-[#006EDD] peer-valid:left-3 peer-valid:text-sm peer-valid:text-[#006EDD] duration-150`}
            htmlFor="confirmpassword"
          >
            Parolni tasdiqlang
          </label>
        </div>

        <p className='text-[#F84800] text-[14px] text-center select-none transition-all'>{`Parolda kamida 8ta belgi bo'lishi kerak`}</p>

        <button className='w-full h-11 rounded-md cursor-pointer text-white text-[16px] outline-0 transition-all bg-[#006EDD]'>{`Ro'yxatdan o'tish`}</button>
      </form>
    </div>
  )
}

export default Register