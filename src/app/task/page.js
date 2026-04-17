import { NotebookPen, NotebookText, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

// Vazifalar ma'lumotlari - kodni toza saqlash uchun alohida ob'ekt
const TASKS = [
  {
    title: "Esse yozish",
    description: "Mavzu asosida o'z fikrlaringizni bayon qiling",
    href: "/task/esse",
    icon: NotebookPen,
    gradient: "from-indigo-600 via-purple-600 to-pink-500",
    shadow: "shadow-indigo-200"
  },
  {
    title: "Matn tahlili",
    description: "Berilgan matnni o'qing va savollarga javob bering",
    href: "/task/text",
    icon: NotebookText,
    gradient: "from-emerald-500 via-teal-600 to-cyan-600",
    shadow: "shadow-emerald-200"
  }
]

const Page = () => {
  return (
    <div className="space-y-5">
      {/* Sarlavha qismi */}
      <div className="relative border-l-4 border-[#8144FE] pl-6 py-2">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Vazifalar <span className="text-[#8144FE]">{`bo'limi`}</span>
        </h1>
        <p className="mt-1 text-slate-500 text-md max-w-2xl font-medium">
          {`Bilim darajangizni oshirish uchun maxsus tayyorlangan mashqlar to'plami.
          O'zingizga ma'qul yo'nalishni tanlang.`}
        </p>
      </div>

      {/* Kartochkalar gridi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {TASKS.map((task, index) => (
          <Link
            key={index}
            href={task.href}
            className="group relative overflow-hidden rounded-3xl p-px transition-all duration-300 hover:scale-[1.02] active:scale-95"
          >
            {/* Orqa fondagi gradient chegara (Border effect) */}
            <div className={`absolute inset-0 bg-linear-to-br ${task.gradient} opacity-20 group-hover:opacity-100 transition-opacity`} />

            {/* Asosiy kontent */}
            <div className="relative bg-white h-full rounded-[23px] p-8 flex flex-col justify-between gap-8 transition-colors group-hover:bg-opacity-90">
              <div className="flex justify-between items-start">
                <div className={`p-4 rounded-2xl bg-linear-to-br ${task.gradient} text-white shadow-xl ${task.shadow}`}>
                  <task.icon size={32} strokeWidth={2.5} />
                </div>
                <ArrowRight className="text-slate-300 group-hover:text-slate-900 group-hover:translate-x-2 transition-all" size={24} />
              </div>

              <div>
                <h2 className="text-2xl font-extrabold text-slate-800 mb-2">
                  {task.title}
                </h2>
                <p className="text-slate-500 font-medium">
                  {task.description}
                </p>
              </div>

              {/* Pastki bezak chizig'i */}
              <div className={`h-1.5 w-12 rounded-full bg-linear-to-r ${task.gradient} group-hover:w-full transition-all duration-500`} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Page