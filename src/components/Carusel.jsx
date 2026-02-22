"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import Link from "next/link";

import "swiper/css";
import "swiper/css/pagination";

export default function HeroSlider() {
  return (
    <Swiper
      modules={[Pagination, Autoplay]}
      slidesPerView={1}
      spaceBetween={30}
      pagination={{ dynamicBullets: true }}
      autoplay={{ delay: 2500, disableOnInteraction: false }}
      loop={true}
      className="rounded-2xl"
    >
      {/* Slide 1 */}
      <SwiperSlide>
        <div className="bg-linear-to-r from-indigo-600 h-full justify-center to-purple-600 w-full text-white p-10 rounded-2xl flex flex-col items-center gap-1.5 sm:gap-3 lg:gap-4">
          <h2 className="text-2xl lg:text-3xl font-bold">
            {`Filolog Onlayn Ta'lim Platformasi`}
          </h2>
          <p className="text-[14px] lg:text-[18px]">Ona tili va adabiyot fanidan professional videodarslar.</p>

          <Link
            href="/lessons"
            className="text-[14px] lg:text-[18px] bg-white text-indigo-600 px-6 py-2 rounded-lg w-fit font-semibold hover:bg-gray-200 transition"
          >
            Batafsil →
          </Link>
        </div>
      </SwiperSlide>

      {/* Slide 2 */}
      <SwiperSlide>
        <div className="w-full bg-linear-to-r h-full justify-center from-blue-600 to-cyan-500 text-white p-10 rounded-2xl flex flex-col gap-1.5 sm:gap-3 lg:gap-4 items-center">
          <h2 className="text-2xl lg:text-3xl font-bold">
            Test va Reyting Tizimi
          </h2>
          <p className="text-[14px] lg:text-[18px]">Bilimingizni testlar orqali sinab ko‘ring.</p>

          <Link
            href="/quiz"
            className="text-[14px] lg:text-[18px] justify-center bg-white text-blue-600 px-6 py-2 rounded-lg w-fit font-semibold hover:bg-gray-200 transition"
          >
            Batafsil →
          </Link>
        </div>
      </SwiperSlide>

      {/* Slide 3 */}
      <SwiperSlide>
        <div className="w-full bg-linear-to-r h-full justify-center from-purple-600 to-pink-500 text-white p-10 rounded-2xl flex flex-col gap-1.5 sm:gap-3 lg:gap-4 items-center">
          <h2 className="text-2xl lg:text-3xl font-bold">
            Raqamli Kutubxona
          </h2>
          <p className="text-[14px] lg:text-[18px]">PDF kitoblarni online o‘qing va bilimni mustahkamlang.</p>

          <Link
            href="/library"
            className="text-[14px] lg:text-[18px] bg-white text-purple-600 px-6 py-2 rounded-lg w-fit font-semibold hover:bg-gray-200 transition"
          >
            Batafsil →
          </Link>
        </div>
      </SwiperSlide>

      {/* Slide 4 */}
      <SwiperSlide>
        <div className="w-full bg-linear-to-r h-full justify-center from-green-600 to-emerald-500 text-white p-10 rounded-2xl flex flex-col gap-1.5 sm:gap-3 lg:gap-4 items-center">
          <h2 className="text-2xl lg:text-3xl font-bold">
            Premium Obuna
          </h2>
          <p className="text-[14px] lg:text-[18px]">Cheksiz darslar, testlar va AI yordamchi imkoniyati.</p>

          <Link
            href="/subscription"
            className="text-[14px] lg:text-[18px] bg-white text-green-600 px-6 py-2 rounded-lg w-fit font-semibold hover:bg-gray-200 transition"
          >
            Batafsil →
          </Link>
        </div>
      </SwiperSlide>
    </Swiper>
  );
}
