'use client'

import Image from 'next/image'
import React, { useState } from 'react'
import { Trophy, Medal, Award, Flame, Calendar, Clock, Star } from 'lucide-react'

const LeaderboardPage = () => {
  const [activeTab, setActiveTab] = useState('weekly')

  // Mock data for different categories
  const data = {
    daily: [
      { id: 1, name: 'Abrorbek Mirzayev', diamonds: 450, rank: 1, trend: 'up' },
      { id: 2, name: 'Musobek Ergashev', diamonds: 420, rank: 2, trend: 'down' },
      { id: 3, name: 'Diyorbek Karimov', diamonds: 380, rank: 3, trend: 'up' },
      { id: 4, name: 'Sardorbek Olimov', diamonds: 310, rank: 4 },
      { id: 5, name: 'Javohirbek Sotvoldiyev', diamonds: 290, rank: 5 },
      { id: 6, name: 'Otabek Ganiyev', diamonds: 250, rank: 6 },
    ],
    weekly: [
      { id: 1, name: 'Musobek Ergashev', diamonds: 1540, rank: 1, trend: 'up' },
      { id: 2, name: 'Diyorbek Karimov', diamonds: 1320, rank: 2, trend: 'up' },
      { id: 3, name: 'Sardorbek Olimov', diamonds: 1100, rank: 3, trend: 'down' },
      { id: 4, name: 'Abrorbek Mirzayev', diamonds: 980, rank: 4 },
      { id: 5, name: 'Javohirbek Sotvoldiyev', diamonds: 850, rank: 5 },
      { id: 6, name: 'Otabek Ganiyev', diamonds: 720, rank: 6 },
      { id: 7, name: 'Umurzoq Shokirov', diamonds: 640, rank: 7 },
      { id: 8, name: 'Lazizbek Nosirov', diamonds: 590, rank: 8 },
    ],
    monthly: [
      { id: 1, name: 'Diyorbek Karimov', diamonds: 5800, rank: 1, trend: 'up' },
      { id: 2, name: 'Musobek Ergashev', diamonds: 5400, rank: 2, trend: 'down' },
      { id: 3, name: 'Sardorbek Olimov', diamonds: 4900, rank: 3, trend: 'up' },
      { id: 4, name: 'Javohirbek Sotvoldiyev', diamonds: 4200, rank: 4 },
      { id: 5, name: 'Abrorbek Mirzayev', diamonds: 3800, rank: 5 },
    ]
  }

  const currentUsers = data[activeTab] || []
  const top3 = currentUsers.slice(0, 3)
  const others = currentUsers.slice(3)

  // Reorder top 3 for podium display (2nd, 1st, 3rd)
  const podiumOrder = [top3[1], top3[0], top3[2]].filter(u => u !== undefined)

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Header & Category Switcher */}
        <div className="flex flex-col items-center gap-8">
          <div className="text-center space-y-3">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              Peshqadamlar <span className="text-indigo-600">Reytingi</span>
            </h1>
            <p className="text-slate-500 font-medium text-lg">Platformaning eng faol bilimdonlari bilan tanishing</p>
          </div>

          <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-1">
            {[
              { id: 'daily', label: 'Kunlik', icon: <Clock size={16} /> },
              { id: 'weekly', label: 'Haftalik', icon: <Calendar size={16} /> },
              { id: 'monthly', label: 'Oylik', icon: <Star size={16} /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center cursor-pointer gap-2 px-6 py-2.5 rounded-xl font-bold transition-all duration-300 ${
                  activeTab === tab.id 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 scale-105' 
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Top 3 Premium Section */}
        <div className="flex flex-row items-end justify-center gap-2 sm:gap-4 lg:gap-8 pt-10">
          {podiumOrder.map((user, index) => {
            const isFirst = user.rank === 1;
            const isSecond = user.rank === 2;
            const isThird = user.rank === 3;

            return (
              <div 
                key={user.id} 
                className={`relative flex flex-col items-center bg-white rounded-[24px] sm:rounded-[40px] p-4 sm:p-8 shadow-xl border border-slate-100 transition-all duration-500 hover:-translate-y-2 group flex-1
                  ${isFirst ? 'h-[300px] sm:h-[420px] border-indigo-100 ring-4 ring-indigo-50/50 scale-105 z-10' : 
                    isSecond ? 'h-[250px] sm:h-[360px]' : 'h-[230px] sm:h-[340px]'}
                `}
              >
                {/* Badge/Icon */}
                <div className={`absolute -top-4 sm:-top-6 p-2 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg transform transition-transform group-hover:rotate-12 ${
                  isFirst ? 'bg-indigo-600 text-white' : 
                  isSecond ? 'bg-slate-600 text-white' : 'bg-amber-600 text-white'
                }`}>
                  {isFirst ? <Trophy className='w-5 h-5 sm:w-7 sm:h-7' /> : isSecond ? <Medal className='w-4 h-4 sm:w-6 sm:h-6' /> : <Award className='w-4 h-4 sm:w-6 sm:h-6' />}
                </div>

                {/* Avatar */}
                <div className="relative mt-2 sm:mt-4 mb-3 sm:mb-6">
                  <div className={`rounded-full p-1 ${
                    isFirst ? 'w-20 h-20 sm:w-32 sm:h-32 bg-linear-to-tr from-indigo-500 to-purple-600' : 'w-16 h-16 sm:w-24 sm:h-24 bg-slate-200'
                  }`}>
                    <div className="w-full h-full bg-white rounded-full p-0.5 sm:p-1">
                      <div className="w-full h-full rounded-full bg-slate-50 relative overflow-hidden">
                        <img 
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} 
                          alt={user.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                  <div className={`absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-6 h-6 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-black shadow-lg border-2 sm:border-4 border-white text-[10px] sm:text-base ${
                    isFirst ? 'bg-indigo-600' : isSecond ? 'bg-slate-600' : 'bg-amber-600'
                  }`}>
                    {user.rank}
                  </div>
                </div>

                {/* Name & Diamonds */}
                <div className="text-center space-y-1 sm:space-y-2 mt-auto">
                  <h3 className={`font-black text-slate-800 truncate max-w-[80px] sm:max-w-none ${isFirst ? 'text-sm sm:text-2xl' : 'text-xs sm:text-xl'}`}>{user.name.split(' ')[0]}</h3>
                  <div className={`flex items-center justify-center gap-1 sm:gap-2 font-black ${isFirst ? 'text-indigo-600 text-sm sm:text-xl' : 'text-slate-500 text-xs sm:text-lg'}`}>
                    <span className="text-sm sm:text-xl transform scale-75 sm:scale-100">💎</span>
                    <span>{user.diamonds.toLocaleString()}</span>
                  </div>
                </div>
                
                {/* Trend Tag */}
                {user.trend && (
                   <div className={`hidden sm:flex mt-4 px-4 py-1 rounded-full text-xs font-black items-center gap-1 ${
                    user.trend === 'up' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                   }`}>
                     <Flame size={12} className={user.trend === 'up' ? 'text-orange-500' : 'text-red-500'} />
                     {user.trend === 'up' ? "O'sish" : 'Tushish'}
                   </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Others List */}
        <div className="bg-white rounded-[24px] sm:rounded-[40px] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden mt-8 sm:mt-12 mb-20 animate-in fade-in duration-700">
          <div className="px-5 sm:px-8 py-4 sm:py-6 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
            <h2 className="text-base sm:text-xl font-black text-slate-800">Barcha Ishtirokchilar</h2>
            <span className="bg-indigo-100 text-indigo-600 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-black tracking-wider uppercase">
              {currentUsers.length} ta jami
            </span>
          </div>

          <div className="divide-y divide-slate-50">
            {others.map((user) => (
              <div 
                key={user.id} 
                className="flex items-center justify-between p-4 sm:p-6 hover:bg-slate-50/80 transition-all duration-300 group cursor-pointer"
              >
                <div className="flex items-center gap-3 sm:gap-6">
                  <span className="text-sm sm:text-xl font-black text-slate-300 w-6 sm:w-8 text-center group-hover:text-indigo-600 transition-colors">
                    {user.rank}
                  </span>
                  
                  <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 p-0.5 group-hover:scale-110 transition-transform">
                    <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} 
                      alt={user.name} 
                      className="w-full h-full object-cover rounded-[10px] sm:rounded-[14px]"
                    />
                  </div>

                  <div className="space-y-0.5">
                    <h4 className="font-black text-slate-800 text-sm sm:text-lg group-hover:text-indigo-600 transition-colors">
                      {user.name}
                    </h4>
                    <p className="text-slate-400 text-[10px] sm:text-sm font-medium">Faol talaba</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 sm:gap-3 bg-slate-50 group-hover:bg-indigo-50 px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-xl sm:rounded-2xl transition-colors">
                  <span className="text-sm sm:text-xl">💎</span>
                  <span className="text-sm sm:text-xl font-black text-slate-900 group-hover:text-indigo-600">{user.diamonds.toLocaleString()}</span>
                </div>
              </div>
            ))}
            
            {others.length === 0 && (
              <div className="p-10 sm:p-20 text-center space-y-4">
                <div className="text-4xl sm:text-6xl text-slate-200">🔍</div>
                <h3 className="text-slate-400 text-sm sm:text-base font-bold">Ma&apos;lumotlar topilmadi</h3>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LeaderboardPage