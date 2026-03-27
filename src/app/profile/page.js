'use client'

import Image from 'next/image'
import React, { use, useState } from 'react'
import { Edit3, Settings, BookOpen, Download, Calendar, Heart, Brain, LogOut } from 'lucide-react'
import UpdateProfileModal from '@/components/UpdateProfileModal'

const Page = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const user = {
    name: "Asadbek Karimov",
    username: "@asadbek_dev",
    bio: "Filologiya bo'yicha mutaxassis va kitobsevar. Bu erda o'zimga yoqqan nodir kitoblarni saqlab boraman.",
    joinDate: "Yanvar 2024",
    avatar: "/assets/book.webp",
    number: "+998 99 123 45 67",
    stats: [
      { label: "Saqlangan kitoblar", count: 24, icon: <Heart size={18} className="text-pink-500" /> },
      { label: "Yechilgan testlar", count: 12, icon: <Brain size={18} className="text-blue-500" /> },
      { label: "Yuklangan kitoblar", count: 8, icon: <Download size={18} className="text-green-500" /> },
    ]
  }

  return (
    <div className="min-h-screen bg-[#F5F8FB] pb-20">
      <div className="relative">
        <div className='h-48 sm:h-64 bg-linear-to-r from-[#8144FE] to-[#5A2DB2] rounded-t-2xl rounded-b-[30px] shadow-lg overflow-hidden'>
          <div className="absolute inset-0 opacity-45 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        </div>

        <div className="container mx-auto px-4 -mt-24 sm:-mt-32 relative z-10">
          <div className="bg-white rounded-3xl bg-linear-to-r from-[#fcfaff] to-white shadow-xl shadow-blue-100/50 p-6 sm:p-8 flex flex-col md:flex-row items-center md:items-end gap-6">
            <div className="relative group">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl border-4 border-white shadow-xl overflow-hidden bg-white">
                <Image
                  src={user.avatar}
                  alt='avatar'
                  width={200}
                  height={200}
                  className='w-full h-full object-cover transition-transform group-hover:scale-105 duration-300'
                />
              </div>
            </div>

            <div className="flex-1 text-center md:text-left flex flex-col gap-1">
              <div className="mb-1">
                <span className="inline-block px-3 py-1 text-xs font-bold text-[#8144FE] bg-[#8144FE]/5 rounded-lg border border-[#8144FE]/10">
                  {user.number}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-[#0F172B]">{user.name}</h1>
              <p className="text-indigo-600 font-medium mb-3">{user.username}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-[#45556C] text-sm">
                <span className="flex items-center gap-1.5 bg-gray-100 px-3 py-1 rounded-full">
                  <Calendar size={14} /> {user.joinDate}da qo&apos;shilgan
                </span>
              </div>
            </div>

            <div className="flex gap-3 mt-4 md:mt-0">
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 cursor-pointer bg-[#8144FE] hover:bg-[#6c34e0] text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-200"
              >
                <Edit3 size={18} /> Profilni tahrirlash
              </button>
              <button className="p-2.5 border-2 border-gray-200 cursor-pointer rounded-xl hover:bg-gray-50 transition-colors text-gray-700">
                <LogOut size={22} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 mt-8 flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/3 flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
            {user.stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg shadow-blue-100/50 p-5 flex items-center justify-between border border-transparent hover:border-indigo-100 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
                    {stat.icon}
                  </div>
                  <span className="text-[#45556C] font-medium">{stat.label}</span>
                </div>
                <span className="text-2xl font-bold text-[#0F172B]">{stat.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:w-2/3 flex flex-col gap-1">
          <div className="flex bg-white p-1.5 rounded-t-2xl shadow-lg shadow-blue-100/50">
            <span
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2`}
            >
              <Calendar size={20} /> Faollik
            </span>
          </div>

          <div className="min-h-[400px]">
            <div className="bg-white rounded-b-3xl shadow-xl shadow-blue-100/50 p-8 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-400 mb-4">
                <Calendar size={40} />
              </div>
              <h3 className="text-xl font-bold text-[#0F172B] mb-2">Hozircha faollik yo&apos;q</h3>
              <p className="text-[#45556C] max-w-xs mx-auto">Siz kitoblarni yuklab olishni boshlashingiz bilan bu erda faolliklar ko&apos;rinadi.</p>
              <button className="mt-6 text-[#8144FE] font-bold hover:underline">Kutubxonaga borish</button>
            </div>
          </div>
        </div>
      </main>

      {isModalOpen ? <UpdateProfileModal setIsModalOpen={setIsModalOpen} /> : ""}
    </div>
  )
}

export default Page