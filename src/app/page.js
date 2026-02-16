import Carusel from "@/components/Carusel";
import StudentDashboard from "@/components/StudentDashboard";

export default function Home() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-[34px] font-semibold">{`Filolog - Onlayn Ta'lim Platformasi`}</h1>
        <p className="text-[18px] text-[#8144FE]">Ona tili va Adabiyot fanidan Milliy sertifikat olish endi qiyin emas!</p>
      </div>
      
      <Carusel />

      <StudentDashboard />
    </div>
  );
}