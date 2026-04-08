import React from "react";
import { 
  MoveRight, BookOpen, Brain, Trophy, Star, 
  Users, CheckCircle2, Code2, GraduationCap, 
  Zap, ArrowUpRight, Github, Twitter, 
  Instagram, Bot, Library, ListChecks, ScrollText,
  Sparkles, LayoutDashboard,
  LogIn
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="flex flex-col scroll-smooth bg-[#020617] text-slate-200 overflow-x-hidden font-sans selection:bg-indigo-500/30">

      {/* 1. HEADER (Server Component Version - No State) */}
      <header className="fixed top-0 w-full z-50 bg-[#020617]/80 backdrop-blur-md border-b border-white/10 py-4">
        <div className="container mx-auto px-4 md:px-6 flex justify-between items-center gap-4">
          
          {/* Logo */}
          <Link href="/" className="hidden sm:flex items-center gap-2 shrink-0">
            <Image src="/assets/logo.png" alt="Filologiya Kelajagi platformasi" width={130} height={100} />
          </Link>
          <Link href="/" className="flex sm:hidden items-center gap-2 shrink-0">
            <Image src="/assets/logo-mini.png" alt="Filologiya Kelajagi platformasi" width={28} height={20} />
          </Link>

          {/* Nav: Desktop va Mobile-da bir xil (Scrollable on mobile) */}
          <nav className="flex items-center gap-4 md:gap-8 overflow-x-auto no-scrollbar py-1">
            <a href="#features" className="text-[10px] md:text-[12px] font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors whitespace-nowrap">Imkoniyatlar</a>
            <a href="#team" className="text-[10px] md:text-[12px] font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors whitespace-nowrap">Asoschilar</a>
          </nav>

          {/* Login Button */}
          <Link href="/auth" className="flex items-center gap-2 px-4 md:px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs md:text-sm transition-all shrink-0">
            <LogIn size={16} /> <span className="hidden sm:inline">Kirish</span>
          </Link>
        </div>
      </header>
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 px-4">
        {/* Murakkab fon effektlari */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-20 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-indigo-600/10 rounded-full blur-[80px] md:blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 -right-20 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-purple-600/10 rounded-full blur-[80px] md:blur-[120px] animate-pulse delay-700" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]" />
        </div>

        <div className="container mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/5 border border-indigo-500/20 mb-6 md:mb-8">
            <Sparkles size={14} className="text-indigo-400" />
            <span className="text-[10px] md:text-xs font-bold tracking-widest uppercase text-indigo-400">{`Yangi davr ta'limi`}</span>
          </div>

          <h1 className="text-4xl md:text-8xl font-black mb-6 md:mb-8 tracking-tighter leading-[1.1] text-white">
            Filologiya <span className="bg-clip-text text-transparent bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400">Kelajagi</span> <br className="hidden md:block" />
            Shu Yerda
          </h1>

          <p className="text-base md:text-xl text-slate-400 mb-10 md:mb-12 max-w-2xl mx-auto leading-relaxed px-4">
          {`Ona tili va adabiyoti fanini shunchaki o'rganmang, uni his qiling. 
          Milliy sertifikat va kirish imtihonlari uchun innovatsion yondashuv.`}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center px-6">
            <Link href="/auth" className="group cursor-pointer relative px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold text-lg transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2 overflow-hidden">
              <span className="relative z-10 flex items-center gap-2">Bepul boshlash <MoveRight size={20} className="group-hover:translate-x-1 transition-transform" /></span>
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. PLATFORMA IMKONIYATLARI (Xususiyatlar) */}
      <section id="features" className="py-24 px-6 relative bg-white/1">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4 italic">Platformada nimalar bor?</h2>
            <p className="text-slate-500 max-w-xl mx-auto italic font-medium">Sizning muvaffaqiyatingiz uchun kerakli barcha vositalar bir joyda jamlangan</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              { 
                icon: <Bot size={28} />, 
                title: "Sun'iy Intellekt", 
                desc: "Sizning savollaringizga 24/7 javob beruvchi va darslarni tushuntiruvchi aqlli yordamchi.",
                color: "text-blue-400", bg: "bg-blue-500/10"
              },
              { 
                icon: <Library size={28} />, 
                title: "Virtual Kutubxona", 
                desc: "Yuzlab badiiy va ilmiy asarlarning raqamli varianti, milliy sertifikat manbalari.",
                color: "text-purple-400", bg: "bg-purple-500/10"
              },
              { 
                icon: <ListChecks size={28} />, 
                title: "Interaktiv Testlar", 
                desc: "DTM va milliy sertifikat standartidagi vaqt bilan chegaralangan real imtihon simulyatsiyasi.",
                color: "text-emerald-400", bg: "bg-emerald-500/10"
              },
              { 
                icon: <LayoutDashboard size={28} />, 
                title: "Peshqadamlar", 
                desc: "Real-vaqt rejimida o'quvchilar reytingi. Eng yaxshi natijalar uchun maxsus sovrinlar.",
                color: "text-amber-400", bg: "bg-amber-500/10"
              },
              { 
                icon: <ScrollText size={28} />, 
                title: "Nazariy Qoidalar", 
                desc: "Soddalashtirilgan va vizual ko'rinishdagi ona tili qoidalari jamlanmasi.",
                color: "text-pink-400", bg: "bg-pink-500/10"
              },
              { 
                icon: <Zap size={28} />, 
                title: "Maxsus Vazifalar", 
                desc: "Har bir darsdan so'ng bilimingizni mustahkamlovchi individual uy vazifalari.",
                color: "text-indigo-400", bg: "bg-indigo-500/10"
              }
            ].map((item, i) => (
              <div key={i} className="group p-8 rounded-[32px] bg-white/5 border border-white/10 hover:border-indigo-500/30 hover:bg-white/8 transition-all duration-500">
                <div className={`w-14 h-14 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. TEAM SECTION */}
      <section id="team" className="py-32 px-6 relative overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 italic">{`Platforma Asoschilari`}</h2>
            <div className="h-1.5 w-24 bg-indigo-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
            {/* Developer Card */}
            <div className="group relative bg-white/3 border border-white/10 p-8 md:p-10 rounded-[40px] hover:bg-white/5 transition-all">
              <div className="absolute -top-10 -left-6 text-7xl md:text-9xl font-black text-white/5 select-none italic">01</div>
              <div className="flex flex-col gap-6 relative z-10">
                <div className="w-16 h-16 bg-indigo-600/20 rounded-2xl flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                  <Code2 size={32} />
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-black text-white mb-2">Musobek Ergashev</h3>
                  <p className="text-indigo-400 font-bold uppercase tracking-widest text-[10px] md:text-xs mb-4 italic">Dasturchi • Platforma Egasi</p>
                    <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                      {`Ushbu platformaning texnik arxitektori. Eng zamonaviy frontend va backend texnologiyalari (React, Next.js, Supabase) yordamida ta'limni raqamlashtirish bo'yicha ekspert. Har bir piksel foydalanuvchi uchun qulay bo'lishiga javobgar.`}
                  </p>
                </div>
                <div className="flex gap-4">
                  <Link href="https://github.com/MusobekErgashev" target="_blank" className="p-2.5 bg-white/5 rounded-xl text-slate-400 hover:text-white transition-colors"><Github size={20} /></Link>
                  <Link href="https://www.instagram.com/prodev_uz" target="_blank" className="p-2.5 bg-white/5 rounded-xl text-slate-400 hover:text-white transition-colors"><Instagram size={20} /></Link>
                </div>
              </div>
            </div>

            {/* Teacher Card */}
            <div className="group relative bg-white/3 border border-white/10 p-8 md:p-10 rounded-[40px] hover:bg-white/5 transition-all">
              <div className="absolute -top-10 -right-6 text-7xl md:text-9xl font-black text-white/5 select-none italic">02</div>
              <div className="flex flex-col gap-6 relative z-10 md:text-left">
                <div className="w-16 h-16 bg-purple-600/20 rounded-2xl flex items-center justify-center text-purple-400 border border-purple-500/20 mx-auto md:ml-0 md:mr-auto">
                  <GraduationCap size={32} />
                </div>
                <div className="md:ml-0 ml-auto">
                  <h3 className="text-2xl md:text-3xl font-black text-white mb-2">Xolmuratova Xurshida</h3>
                  <p className="text-purple-400 font-bold uppercase tracking-widest text-[10px] md:text-xs mb-4 italic">{`O'qituvchi • Platforma Admini`}</p>
                  <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                    {`Ona tili va adabiyoti bo'yicha yuqori malakali mutaxassis. Platformadagi barcha metodik qo'llanmalar va intellektual testlar muallifi. O'quvchilarning akademik o'sishini nazorat qiluvchi va ta'lim sifatini ta'minlovchi boshqaruvchi.`}
                  </p>
                </div>
                <div className="flex gap-2 justify-start">
                   <span className="px-3 py-1 bg-purple-500/10 text-purple-400 text-[10px] rounded-full border border-purple-500/20 font-bold uppercase">Metodist</span>
                   <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-[10px] rounded-full border border-indigo-500/20 font-bold uppercase">Expert</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CTA SECTION */}
      <section className="py-24 px-6">
        <div className="container mx-auto">
          <div className="bg-linear-to-r from-indigo-600 to-purple-600 rounded-[40px] p-8 md:p-16 text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/white-diamond.png')] opacity-10 pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-6">{`Bilimingizni bugunoq sinab ko'ring!`}</h2>
              <p className="text-white/80 mb-10 max-w-xl mx-auto font-medium">{`Platformadan foydalanish mutlaqo sodda va intuitiv. Ro'yxatdan o'ting va o'ziningizning shaxsiy o'quv rejangizga ega bo'ling.`}</p>
              <Link href="/auth" className="px-10 cursor-pointer py-4 bg-white text-indigo-600 rounded-2xl font-black text-lg hover:shadow-2xl hover:scale-105 transition-all active:scale-95">
                {`Ro'yxatdan o'tish`}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="py-12 border-t border-white/5 bg-[#01040f]">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex flex-col items-center md:items-start gap-4">
             <Image src="/assets/logo.png" alt="Filologiya Kelajagi platformasi" width={130} height={100} />
             <p className="text-slate-500 text-xs font-medium tracking-wide">Filologiya Kelajagi</p>
          </div>
          
          <div className="text-center md:text-left order-3 md:order-2">
            <p className="text-slate-400 text-sm italic">{`© 2026 Filolog Onlayn Ta'lim. Barcha huquqlar himoyalangan.`}</p>
          </div>

          <div className="flex gap-4 order-2 md:order-3">
             <Link href="https://t.me/prodev_uz" target="_blank" className="px-6 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-white text-xs font-bold border border-white/5 transition-all">
                Yordam kerakmi?
             </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}