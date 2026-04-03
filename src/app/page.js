import Carusel from "@/components/Carusel";
import StudentDashboard from "@/components/StudentDashboard";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-[26px] sm:text-[30px] lg:text-[34px] font-semibold leading-7 sm:leading-9 lg:leading-11">{`Filolog - Onlayn Ta'lim Platformasi`}</h1>
        <p className="text-[14px] lg:text-[18px] text-[#8144FE]">{`Ona tilingizni biz bilan o'rganing!`}</p>
      </div>
      
      <Carusel />

      <StudentDashboard />
    </div>
  );
}