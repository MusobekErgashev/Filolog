import StudentDashboard from "@/components/StudentDashboard";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-[34px] font-semibold">Filolog - Onlayn Ta'lim Platformasi</h1>
        <p className="text-[18px] text-[#8144FE]">Ona tili va Adabiyot fanidan Milliy sertifikat olish endi qiyin emas!</p>
      </div>

      <StudentDashboard />
    </div>
  );
}