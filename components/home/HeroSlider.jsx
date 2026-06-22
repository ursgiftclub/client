"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

export default function HeroSlider() {
  const swiperRef = useRef(null);

  const [activeIndex, setActiveIndex] = useState(0);

  const slides = [
    {
      id: 1,
      desktopImage:
        "https://placehold.co/1800x700/1a141c/f18cad?text=Luxury+Gift+Collection",
      mobileImage:
        "https://placehold.co/800x1000/1a141c/f18cad?text=Luxury+Gifts",
      link: "/shop",
    },

    {
      id: 2,
      desktopImage:
        "https://placehold.co/1800x700/241820/ff94b6?text=Personalized+Gifts",
      mobileImage:
        "https://placehold.co/800x1000/241820/ff94b6?text=Personalized",
      link: "/shop?category=personalized",
    },

    {
      id: 3,
      desktopImage:
        "https://placehold.co/1800x700/151218/f8c1d4?text=Special+Occasion+Gifts",
      mobileImage:
        "https://placehold.co/800x1000/151218/f8c1d4?text=Occasion+Gifts",
      link: "/categories",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-background">
      <Swiper
        modules={[Autoplay]}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        loop
        className="w-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <Link href={slide.link} className="block">
              <div className="relative overflow-hidden">
                {/* Desktop */}
                <div className="relative hidden h-155 md:block">
                  <Image
                    src={slide.desktopImage}
                    alt={`Banner ${slide.id}`}
                    fill
                    priority
                    className="object-cover transition duration-500 hover:scale-[1.02]"
                  />
                </div>

                {/* Mobile */}
                <div className="relative h-105 sm:h-130 md:hidden">
                  <Image
                    src={slide.mobileImage}
                    alt={`Banner ${slide.id}`}
                    fill
                    priority
                    className="object-cover"
                  />
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Progress Bars */}
      {/* Slider Indicators */}
      <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3 rounded-full border border-white/10 bg-black/20 px-4 py-2 backdrop-blur-xl">
        {slides.map((slide, index) => {
          const isActive = activeIndex === index;

          return (
            <button
              key={slide.id}
              onClick={() => swiperRef.current?.slideToLoop(index)}
              className={`relative flex cursor-pointer items-center justify-center transition-all duration-300 hover:scale-110 ${
                isActive
                  ? "h-3 w-14"
                  : "h-3 w-3 rounded-full border border-white/40 bg-white/30 hover:border-white hover:bg-white/50"
              }`}
            >
              {/* Active Progress Bar */}
              {isActive && (
                <div className="relative h-2 w-14 overflow-hidden rounded-full bg-white/20">
                  <div className="animate-progress absolute left-0 top-0 h-full rounded-full bg-white" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
