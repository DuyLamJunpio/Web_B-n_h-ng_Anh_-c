"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Compass, ShieldCheck, ArrowDown, Flame, Waves, SunDim } from "lucide-react";
import HeroNature3D, { AtmosphereMode } from "./HeroNature3D";

export default function Hero() {
  const [atmosphere, setAtmosphere] = useState<AtmosphereMode>("mystic");

  return (
    <section className="relative min-h-[96vh] flex flex-col justify-between items-center text-center px-4 sm:px-8 lg:px-12 xl:px-16 overflow-hidden pt-28 pb-12 w-full">
      {/* 1. IMMERSIVE THREE.JS 3D NATURE WORLD BACKGROUND */}
      <div className="absolute inset-0 z-0 bg-charcoal-900 overflow-hidden">
        <HeroNature3D
          atmosphere={atmosphere}
          onAtmosphereChange={(mode) => setAtmosphere(mode)}
        />
      </div>

      {/* Top Spacer */}
      <div />

      {/* 2. MAIN HERO CONTENT OVERLAY */}
      <div className="relative z-10 w-full max-w-5xl mx-auto space-y-8 my-auto py-6 pointer-events-none">
        {/* Glowing Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-charcoal-900/80 backdrop-blur-md border border-amberWood/35 text-amberWood text-[11px] sm:text-xs tracking-[0.3em] uppercase shadow-2xl shadow-amberWood/10 pointer-events-auto"
        >
          <Sparkles className="w-3.5 h-3.5 text-amberWood animate-pulse" />
          <span>Thánh Mộc Rừng Thiêng &amp; Chữa Lành Tâm Trí</span>
          <span className="text-stone-500">•</span>
          <span className="text-stone-300 font-serif lowercase italic text-sm">tần số 432hz</span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-stone-100 font-light tracking-wide leading-[1.08] text-balance drop-shadow-[0_10px_35px_rgba(0,0,0,0.8)] pointer-events-auto"
        >
          Trở về với <br />
          <span className="italic text-amberWood font-normal relative inline-block">
            sự tĩnh tại.
            <span className="absolute -bottom-2 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amberWood/60 to-transparent"></span>
          </span>
        </motion.h1>

        {/* Subtitle description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: "easeOut" }}
          className="max-w-2xl mx-auto text-stone-200 font-light text-base sm:text-lg md:text-xl leading-relaxed tracking-wide text-pretty drop-shadow-md pointer-events-auto"
        >
          Hành trình thanh tẩy không gian sống và vỗ về tâm trí qua những tạo tác nguyên bản từ{" "}
          <span className="text-amberWood-light font-normal">gỗ thánh Palo Santo</span>,{" "}
          <span className="text-amberWood-light font-normal">xô thơm California</span> và{" "}
          <span className="text-amberWood-light font-normal">trầm hương tự nhiên</span>.
        </motion.p>

        {/* Call to Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 pointer-events-auto"
        >
          <a
            href="#sanctuary-3d"
            className="w-full sm:w-auto px-8 py-4 bg-amberWood hover:bg-amberWood-dark text-charcoal-900 font-semibold text-xs tracking-[0.25em] uppercase transition-all duration-300 rounded-sm shadow-2xl shadow-amberWood/30 hover:shadow-amberWood/50 hover:scale-[1.02] flex items-center justify-center gap-2 group cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-charcoal-900 group-hover:scale-110 transition-transform" />
            <span>Trải Nghiệm Nghi Thức 3D</span>
          </a>
          <a
            href="#collections"
            className="w-full sm:w-auto px-8 py-4 border border-amberWood/40 hover:border-amberWood text-stone-200 hover:text-amberWood font-medium text-xs tracking-[0.25em] uppercase transition-all duration-300 rounded-sm bg-charcoal-900/80 backdrop-blur-md hover:bg-charcoal-800 flex items-center justify-center gap-2 cursor-pointer shadow-lg"
          >
            <Flame className="w-4 h-4 text-amberWood" />
            <span>Khám Phá Vật Phẩm</span>
          </a>
          <a
            href="#quiz"
            className="w-full sm:w-auto px-7 py-4 border border-stone-700/80 hover:border-stone-500 text-stone-300 hover:text-stone-100 font-medium text-xs tracking-[0.2em] uppercase transition-all duration-300 rounded-sm bg-charcoal-900/80 backdrop-blur-md flex items-center justify-center gap-2 cursor-pointer shadow-lg"
          >
            <span>Trắc Nghiệm Mùi Hương</span>
          </a>
        </motion.div>
      </div>

      {/* 3. BOTTOM TRUST HIGHLIGHTS STRETCHING ACROSS FULL CONTAINER */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.9 }}
        className="relative z-10 w-full max-w-[1400px] mx-auto pt-8 border-t border-amberWood/20 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-stone-300"
      >
        <div className="flex flex-wrap justify-center sm:justify-start items-center gap-6 sm:gap-8 text-[11px] tracking-wider uppercase font-light">
          <span className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-amberWood animate-ping"></span>
            100% Gỗ &amp; Thảo Mộc Rừng Tự Nhiên
          </span>
          <span className="hidden md:inline text-stone-700">|</span>
          <span className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-amberWood" />
            Thu Hái Nhân Đạo &amp; Bền Vững
          </span>
          <span className="hidden md:inline text-stone-700">|</span>
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amberWood" />
            Bảo Toàn Tinh Dầu Nguyên Bản
          </span>
        </div>

        <a
          href="#about"
          className="flex items-center gap-2 text-stone-300 hover:text-amberWood transition-colors tracking-widest text-[11px] uppercase group cursor-pointer"
        >
          <span>Khám phá triết lý</span>
          <ArrowDown className="w-3.5 h-3.5 text-amberWood group-hover:translate-y-1 transition-transform" />
        </a>
      </motion.div>
    </section>
  );
}
