import Image from "next/image";
import Link from "next/link";
import { MoveRight, BookOpen, Brain, Trophy, Star } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col -m-4 md:-m-6 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-slate-900">
        {/* Background Patterns */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-600 rounded-full blur-[120px] opacity-20"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-600 rounded-full blur-[120px] opacity-20"></div>

        <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">
          <div className="mb-6 animate-in fade-in slide-in-from-top-4 duration-700">
             <span className="px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-bold tracking-wide uppercase">
                Ona tili va Adabiyot platformasi
             </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-tight max-w-4xl">
            Kelajagingizni <span className="text-indigo-500">Filolog</span> bilan birga quring
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl leading-relaxed">
            Milliy sertifikat va kirish imtihonlariga tayyorlanishning eng zamonaviy, qulay va samarali usuli. Professional videodarslar va intellektual testlar.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link 
              href="/auth" 
              className="px-10 py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-lg transition-all shadow-xl shadow-indigo-500/20 hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              Boshlash <MoveRight size={20} />
            </Link>
            <Link 
              href="/auth" 
              className="px-10 py-5 bg-white/5 hover:bg-white/10 backdrop-blur-md text-white border border-white/10 rounded-2xl font-black text-lg transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
            >
              Kirish
            </Link>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-32 bg-linear-to-t from-slate-900 to-transparent"></div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-24 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Nega aynan biz?</h2>
            <p className="text-slate-500 font-medium">Biz sizga eng yaxshi natijalarni kafolatlaymiz</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: "Professional Darslar", 
                desc: "Tajribali ustozlar tomonidan tayyorlangan yuqori sifatli video darsliklar.",
                icon: <BookOpen className="text-indigo-600" />,
                color: "bg-indigo-50"
              },
              { 
                title: "Intellektual Testlar", 
                desc: "Bilimingizni mustahkamlash uchun milliy sertifikat darajasidagi testlar.",
                icon: <Brain className="text-purple-600" />,
                color: "bg-purple-50"
              },
              { 
                title: "Reyting Tizimi", 
                desc: "O&apos;z bilimingizni boshqa o&apos;quvchilar bilan solishtiring va doimiy o&apos;sib boring.",
                icon: <Trophy className="text-amber-600" />,
                color: "bg-amber-50"
              }
            ].map((feature, i) => (
              <div key={i} className="p-8 rounded-[32px] border border-slate-100 hover:border-indigo-100 transition-all hover:shadow-2xl hover:shadow-slate-200">
                <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-6`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer-like CTA */}
      <section className="bg-indigo-600 py-20 px-6">
        <div className="container mx-auto text-center flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-white text-sm font-bold mb-6 backdrop-blur-sm">
                <Star size={16} fill="white" /> To'g'ri tanlov
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-8 max-w-2xl">
                O&apos;z bilimingizni hoziroq sinab ko&apos;ring
            </h2>
            <Link 
              href="/auth" 
              className="px-12 py-5 bg-white text-indigo-600 rounded-2xl font-black text-xl hover:shadow-2xl transition-all hover:scale-105 active:scale-95"
            >
              Ro'yxatdan o'tish
            </Link>
        </div>
      </section>
    </div>
  );
}