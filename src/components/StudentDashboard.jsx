'use client'

import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'

const StudentDashboard = () => {
    const [userCount, setUserCount] = useState(0)

    useEffect(() => {
        const fetchUserCount = async () => {
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('id')

                if (error) {
                    console.error("Profil count yuklashda xatolik:", error)
                    setUserCount(0)
                } else if (data) {
                    setUserCount(data.length)
                }
            } catch (error) {
                console.error("Profil count kutilmagan xato:", error)
            }
        }
        fetchUserCount()
    }, [])

    const dataStudent = [
        {
            id: 1,
            title: "Foydalanuvchilar",
            value: userCount,
            icon: "/assets/users.png",
            color: "bg-[#0097F6]",
        },
        {
            id: 2,
            title: "Reytingim",
            value: 0,
            icon: "/assets/yourRank.png",
            color: "bg-[#E641B4]",
        },
        {
            id: 3,
            title: "Bugun",
            value: 0,
            icon: "/assets/todayTime.png",
            color: "bg-[#00C463]",
        },
        {
            id: 4,
            title: "Umumiy",
            value: 0,
            icon: "/assets/allTime.png",
            color: "bg-[#94CF13]",
        },
    ]

    return (
        <div className='grid grid-cols-1 sm:grid-cols-2 w-full justify-between xl:grid-cols-4 gap-2'>
            {
                dataStudent.map((item) => {
                    return (
                        <div key={item.id} className='flex justify-between w-full bg-white p-6 rounded-2xl shadow-xl transition-all hover:shadow-2xl shadow-gray-200'>
                            <div className='flex flex-col justify-between'>
                                <h2 className='text-[16px] lg:text-[20px] font-medium'>{item.title}</h2>
                                <h1 className='text-[14px] lg:text-[16px]'>{item.value} {item.id == 1 ? "ta" : item.id == 2 ? "- o'rin" : "soat"}</h1>
                            </div>
                            <div className={`${item.color} p-2.5 w-max h-max rounded-2xl`}>
                                <Image src={item.icon} alt='icon' width={0} height={0} className='min-w-7 min-h-7 lg:min-w-8 lg:min-h-8' />
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default StudentDashboard