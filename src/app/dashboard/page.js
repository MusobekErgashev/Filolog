import Carusel from "@/components/Carusel";
import StudentDashboard from "@/components/StudentDashboard";
import Image from "next/image";
import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-5">
      {/* <div className="text-center md:text-left space-y-1 md:space-y-0">
        <h1 className="text-[28px] sm:text-[30px] lg:text-[34px] font-black leading-7 sm:leading-9 lg:leading-11">{`Filolog - Onlayn Ta'lim Platformasi`}</h1>
        <p className="text-[14px] max-w-[70%] md:max-w-auto mx-auto md:mx-0 lg:text-[18px] text-[#8144FE]">Ona tili va Adabiyot fanidan Milliy sertifikat olish endi qiyin emas!</p>
      </div> */}

      <div className="relative border-l-4 border-[#8144FE] pl-6 py-2">
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          <span className="text-[#8144FE]">Filolog</span> - Onlayn Ta'lim Platformasi
        </h1>
        <p className="mt-1 text-slate-500 text-lg max-w-2xl font-medium">
          Ona tili va Adabiyot fanidan Milliy sertifikat olish endi qiyin emas!
        </p>
      </div>

      <Carusel />

      <StudentDashboard />

      <p className="text-[14px] text-center mt-3 lg:text-[18px] text-gray-400">Yangiliklarda qolib ketmaslik uchun bizni <Link href="https://t.me/FilologOnlayn" target="_blank" className="text-[#8144FE] font-semibold">Telegram</Link> kanalimizga obuna bo'ling!</p>
    </div>
  );
}