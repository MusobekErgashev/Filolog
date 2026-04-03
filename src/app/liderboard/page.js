import Image from 'next/image'
import React from 'react'

const LeaderboardPage = () => {
  // Mock data - in a real app this would come from a database/API
  const users = [
    { id: 1, name: 'Musobek Ergashev', diamonds: 1540, rank: 1 },
    { id: 2, name: 'Diyorbek Karimov', diamonds: 1320, rank: 2 },
    { id: 3, name: 'Sardorbek Olimov', diamonds: 1100, rank: 3 },
    { id: 4, name: 'Abrorbek Mirzayev', diamonds: 980, rank: 4 },
    { id: 5, name: 'Javohirbek Sotvoldiyev', diamonds: 850, rank: 5 },
    { id: 6, name: 'Otabek Ganiyev', diamonds: 720, rank: 6 },
    { id: 7, name: 'Umurzoq Shokirov', diamonds: 640, rank: 7 },
    { id: 8, name: 'Lazizbek Nosirov', diamonds: 590, rank: 8 },
  ]

  const top3 = [users[1], users[0], users[2]] // 2nd, 1st, 3rd for podium layout

  return (
    <div className="flex flex-col gap-10 py-6 max-w-5xl mx-auto min-h-screen">
      {/* Header Section */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
          Peshqadamlar <span className="text-[#8144FE]">Taxtasi</span>
        </h1>
        <p className="text-[14px] sm:text-[18px] text-gray-500 font-medium">Platformaning eng bilimdon va faol foydalanuvchilari</p>
      </div>

      {/* Podium Section */}
      <div className="relative mt-8 sm:mt-16 mb-6">
        <div className="flex justify-center items-end gap-2 sm:gap-8 min-h-[300px]">
          {top3.map((user, index) => {
            const isFirst = index === 1;
            const isSecond = index === 0;
            const isThird = index === 2;

            return (
              <div key={user.id} className={`flex flex-col items-center transition-all duration-700 ${isFirst ? 'z-20 -mb-4' : 'z-10'}`}>
                {/* Avatar Area */}
                <div className="relative mb-4 group cursor-pointer">
                  {/* Glowing background for 1st */}
                  {isFirst && (
                    <div className="absolute -inset-4 bg-[#8144FE]/20 rounded-full blur-xl animate-pulse"></div>
                  )}

                  <div className={`
                    relative rounded-full p-1.5 shadow-2xl transition-transform duration-500 group-hover:scale-110
                    ${isFirst ? 'w-28 h-28 sm:w-36 sm:h-36 bg-gradient-to-tr from-yellow-300 via-yellow-500 to-yellow-600' : 
                      isSecond ? 'w-24 h-24 sm:w-30 sm:h-30 bg-gradient-to-tr from-slate-300 via-slate-400 to-slate-500' :
                      'w-22 h-22 sm:w-28 sm:h-28 bg-gradient-to-tr from-amber-600 via-amber-700 to-amber-800'}
                  `}>
                    <div className="w-full h-full bg-white rounded-full p-1">
                      <div className="w-full h-full rounded-full bg-slate-100 overflow-hidden relative">
                        <img 
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} 
                          alt={user.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Rank Badge */}
                    <div className={`
                      absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-white font-black text-sm shadow-xl border-2 border-white
                      ${isFirst ? 'bg-yellow-500' : isSecond ? 'bg-slate-400' : 'bg-amber-700'}
                    `}>
                      #{user.rank}
                    </div>

                    {/* Crown Icon for 1st */}
                    {isFirst && (
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 animate-bounce drop-shadow-lg">
                        <span className="text-5xl text-yellow-500">👑</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Info Area */}
                <div className="text-center mb-4 min-h-[60px]">
                  <h3 className={`font-black text-gray-900 truncate max-w-[120px] sm:max-w-[180px] ${isFirst ? 'text-lg sm:text-2xl' : 'text-sm sm:text-lg'}`}>
                    {user.name.split(' ')[0]}
                  </h3>
                  <div className={`flex items-center justify-center gap-1.5 font-bold ${isFirst ? 'text-[#8144FE] text-base sm:text-xl' : 'text-gray-500 text-sm sm:text-base'}`}>
                    <span className="text-yellow-500">💎</span>
                    <span>{user.diamonds}</span>
                  </div>
                </div>

                {/* Visual Step/Podium */}
                <div className={`
                  rounded-t-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] transition-all duration-1000
                  ${isFirst ? 'h-36 sm:h-52 w-32 sm:w-40 lg:w-48 bg-linear-to-b from-[#8144FE] to-[#5C24D4]' : 
                    isSecond ? 'h-24 sm:h-36 w-28 sm:w-32 lg:w-44 bg-linear-to-b from-[#A07CFE] via-[#8144FE] to-[#8144FE]' :
                    'h-20 sm:h-32 w-28 sm:w-32 lg:w-44 bg-linear-to-b from-[#A07CFE] via-[#8144FE] to-[#8144FE]'}
                `}></div>
              </div>
            );
          })}
        </div>
      </div>

      {/* List Section - Minimalist v3 */}
      <div className="max-w-4xl mx-auto w-full">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800 tracking-tight">Qolgan Ishtirokchilar</h2>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{users.length} ta jami</span>
          </div>
          
          <div className="divide-y divide-gray-50">
            {users.slice(3).map((user) => (
              <div 
                key={user.id} 
                className="flex items-center justify-between p-4 sm:p-5 hover:bg-gray-50/50 transition-all duration-300 group"
              >
                <div className="flex items-center gap-4 sm:gap-8">
                  <span className="text-lg font-bold text-gray-300 w-6 text-center group-hover:text-[#8144FE] transition-colors">
                    {user.rank}
                  </span>
                  
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                    <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} 
                      alt={user.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <h4 className="font-bold text-gray-700 text-sm sm:text-lg group-hover:text-gray-900 transition-colors">
                    {user.name}
                  </h4>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-lg sm:text-xl transform group-hover:scale-110 transition-transform">💎</span>
                  <span className="text-base sm:text-lg font-extrabold text-gray-900">{user.diamonds}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LeaderboardPage