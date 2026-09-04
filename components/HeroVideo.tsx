"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Sparkles, Play, Pause, ArrowDown, Compass, ShieldCheck } from "lucide-react";

export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <section className="relative w-full min-h-[100dvh] flex flex-col justify-between items-center text-center px-4 sm:px-8 lg:px-12 xl:px-16 overflow-hidden pt-32 pb-12 bg-linen-base">
      {/* 1. CINEMATIC BACKGROUND VIDEO - MORNING MIST SANCTUARY */}
      <div className="absolute inset-0 z-0 bg-linen-base overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          poster="https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80&w=1920"
          className="w-full h-full object-cover opacity-45 filter saturate-75 brightness-105 scale-105 transition-transform duration-1000 ease-out"
        >
          <source src="/videos/smoke-1080p.webm" type="video/webm" media="(min-width: 768px)" />
          <source src="/videos/smoke-480p.webm" type="video/webm" />
          <source src="/videos/smoke-hero.webm" type="video/webm" />
        </video>

        {/* Ambient Morning Botanical Mist Overlay Gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(247,248,244,0.72)_0%,rgba(240,243,235,0.92)_100%)] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/85 via-transparent to-linen-base pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-linen-base to-transparent pointer-events-none" />
      </div>

      {/* Top Spacer for Header Balance */}
      <div className="h-4" />

      {/* 2. HERO CONTENT OVERLAY */}
      <div className="relative z-10 w-full max-w-5xl mx-auto space-y-8 my-auto py-6">
        {/* Subtle Top Eyebrow Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/90 backdrop-blur-xl border border-forest-800/15 text-forest-800 text-[11px] sm:text-xs tracking-[0.3em] uppercase shadow-md shadow-forest-900/5"
        >
          <Sparkles className="w-3.5 h-3.5 text-forest-600 animate-pulse" />
          <span>Aura &amp; Natural Rituals</span>
          <span className="text-forest-400 font-mono">/</span>
          <span className="text-forest-700 font-serif italic text-xs">Thánh Mộc Rừng Sâu</span>
        </motion.div>

        {/* Main Heading with Descender Clearance */}
        <motion.h1
          initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-[7.5rem] text-forest-950 font-light tracking-wide leading-[1.08] text-balance drop-shadow-sm descender-safe"
        >
          Trở về với <br />
          <span className="italic text-forest-700 font-normal relative inline-block">
            sự tĩnh tại.
            <span className="absolute -bottom-1.5 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-forest-600/50 to-transparent" />
          </span>
        </motion.h1>

        {/* Subtitle Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mx-auto text-forest-800/85 font-light text-base sm:text-lg md:text-xl leading-relaxed tracking-wide text-pretty"
        >
          Hành trình thanh tẩy không gian sống và vỗ về tâm trí qua những tạo tác nguyên bản từ{" "}
          <strong className="text-forest-950 font-medium">gỗ thánh Palo Santo</strong>,{" "}
          <strong className="text-forest-950 font-medium">xô thơm trắng</strong> và{" "}
          <strong className="text-forest-950 font-medium">nến thơm sáp đậu nành</strong>.
        </motion.p>

        {/* Call To Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5"
        >
          <a
            href="#collections"
            className="w-full sm:w-auto px-8 py-4 bg-forest-800 hover:bg-forest-700 text-white font-semibold text-xs tracking-[0.25em] uppercase transition-all duration-300 rounded-full shadow-xl shadow-forest-900/15 hover:shadow-forest-900/25 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Khám Phá Bảo Vật</span>
          </a>

          <a
            href="#ritual"
            className="w-full sm:w-auto px-8 py-4 border border-forest-800/25 hover:border-forest-700 text-forest-900 hover:text-forest-700 font-medium text-xs tracking-[0.25em] uppercase transition-all duration-300 rounded-full bg-white/90 backdrop-blur-md hover:bg-forest-50 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-forest-900/5"
          >
            <span>Nghi Thức Thở 4-3-4</span>
          </a>
        </motion.div>
      </div>

      {/* 3. BOTTOM PROVENANCE METRICS & VIDEO CONTROLS */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.7 }}
        className="relative z-10 w-full max-w-[1400px] mx-auto pt-8 border-t border-forest-800/15 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-forest-800/90"
      >
        <div className="flex flex-wrap justify-center sm:justify-start items-center gap-6 sm:gap-8 text-[11px] font-mono tracking-wider uppercase text-forest-800/80">
          <span className="flex items-center gap-2 text-forest-900 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-forest-600 animate-pulse" />
            100% Gỗ Rụng Tự Nhiên
          </span>
          <span className="hidden md:inline text-forest-300">|</span>
          <span className="flex items-center gap-2">
            <Compass className="w-3.5 h-3.5 text-forest-700" />
            SERFOR Peru Bảo Tồn Rừng
          </span>
          <span className="hidden md:inline text-forest-300">|</span>
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-forest-700" />
            Tần Số Năng Lượng 432Hz
          </span>
        </div>

        {/* Video Ambient Control Toggle */}
        <div className="flex items-center gap-4">
          <button
            onClick={togglePlay}
            title={isPlaying ? "Tạm dừng video nền" : "Phát video nền"}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 border border-forest-800/15 hover:border-forest-700 text-forest-800 hover:text-forest-950 text-[11px] font-mono uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3 h-3 text-forest-700" />
                <span>Video Đang Phát</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 text-forest-700" />
                <span>Tạm Dừng</span>
              </>
            )}
          </button>

          <a
            href="#showcase"
            aria-label="Cuộn xuống khám phá"
            className="flex items-center gap-2 text-forest-700 hover:text-forest-950 transition-colors tracking-widest text-[11px] font-mono uppercase cursor-pointer"
          >
            <span className="hidden lg:inline">Chi Tiết</span>
            <ArrowDown className="w-3.5 h-3.5 text-forest-700" />
          </a>
        </div>
      </motion.div>
    </section>
  );
}
