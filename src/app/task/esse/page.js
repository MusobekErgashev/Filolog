import TaskPage from '@/components/TaskPage'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <div className='space-y-10'>
      <div className="relative border-l-4 space-y-2 border-[#8144FE] pl-6 py-2">
        <Link href={'/task'} className='bg-white w-max px-4 py-1.5 rounded-md shadow-sm hover:scale-105 hover:text-[#8144FE] ease-in-out transition-all cursor-pointer flex items-center text-slate-600 gap-2'> <ArrowLeft className='' /> Orqaga</Link>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Esse <span className="text-[#8144FE]">{`bo'limi`}</span>
        </h1>
      </div>

      <TaskPage />
    </div>
  )
}

export default page