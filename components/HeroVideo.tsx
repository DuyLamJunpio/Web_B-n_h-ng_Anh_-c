"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useCart } from "@/lib/CartContext";

const fallbackStories = [
  {
    eyebrow: "",
    title: "Ngàn lẻ một câu chuyện về những nốt hương",
    description: "Một cơn gió mát lành của sự sáng tạo mùi hương. Để đưa bạn vào một hành trình mới...",
    cta: "Khám phá ngay bộ sưu tập",
    image: "/videos/0918.mp4",
    poster: "/videos/palo-santo-poster.jpg",
    alt: "Ngàn lẻ một câu chuyện về những nốt hương - RUNGU",
    mediaType: "video" as const,
    ctaLink: "/san-pham",
  },
  {
    eyebrow: "Palo Santo",
    title: "Câu chuyện về gỗ thiêng",
    description: "Gỗ Palo santo - hay còn được gọi là: gỗ thánh. Được khai thác trong những cánh rừng già ở Peru. Palo Santo ủ một lớp tinh dầu thơm trong từng thớ gỗ. Chờ toả hương",
    cta: "Khám phá danh mục sản phẩm",
    image: "/videos/palo-santo-hero.mp4",
    poster: "/videos/palo-santo-poster.jpg",
    alt: "Câu chuyện về gỗ thiêng - Gỗ Palo Santo tự nhiên",
    mediaType: "video" as const,
    ctaLink: "/san-pham",
  },
  {
    eyebrow: "",
    title: "Câu chuyện về sự giao thoa giữa âm nhạc và nghệ thuật",
    description: "Âm nhạc là cơn gió mát xoa dịu tâm hồn bạn",
    cta: "Đọc câu chuyện văn hóa",
    image: "/videos/loa_4K_enhanced.mp4",
    poster: "/videos/palo-santo-poster.jpg",
    alt: "Câu chuyện về sự giao thoa giữa âm nhạc và nghệ thuật - RUNGU",
    mediaType: "video" as const,
    ctaLink: "/#stories",
  },
] as const;

export default function HeroVideo() {
  const { storefrontContent } = useCart();
  const [activeStory, setActiveStory] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isSoundOn, setIsSoundOn] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const soundTimerRef = useRef<NodeJS.Timeout | null>(null);
  const reduceMotion = useReducedMotion();

  const stories = storefrontContent.banners.length > 0
    ? storefrontContent.banners.map((banner) => ({
        eyebrow: "",
        title: banner.heading || "Ngàn lẻ một câu chuyện về những nốt hương",
        description: banner.subheading || "Một cơn gió mát lành của sự sáng tạo mùi hương. Để đưa bạn vào một hành trình mới...",
        cta: banner.cta_label || "Khám phá ngay bộ sưu tập",
        image: banner.media,
        alt: banner.alt || banner.heading || "Câu chuyện nổi bật của RUNGU",
        mediaType: banner.media_type,
        poster: banner.poster || "/videos/palo-santo-poster.jpg",
        ctaLink: banner.cta_link || "/san-pham",
      }))
    : fallbackStories;

  const story = stories[activeStory];

  // 432Hz Tibetan Singing Bowl Web Audio Synthesis
  const playSingingBowl = () => {
    try {
      if (typeof window === "undefined") return;
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtxRef.current || audioCtxRef.current.state === "closed") {
        audioCtxRef.current = new AudioCtx();
      }
      if (audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }
      const ctx = audioCtxRef.current;
      const now = ctx.currentTime;
      const baseFreq = 216; // A3 harmonic base for 432Hz
      const harmonics = [1, 2.76, 5.4, 8.93];
      const gains = [0.22, 0.10, 0.04, 0.015];

      harmonics.forEach((harmonic, index) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(baseFreq * harmonic, now);
        osc.frequency.linearRampToValueAtTime(baseFreq * harmonic * 0.998, now + 5.5);

        gainNode.gain.setValueAtTime(0.001, now);
        gainNode.gain.linearRampToValueAtTime(gains[index], now + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 6.8);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 7.0);
      });
    } catch {
      // Audio autoplay policy fallback
    }
  };

  const toggleSound = () => {
    if (isSoundOn) {
      setIsSoundOn(false);
      if (soundTimerRef.current) {
        clearInterval(soundTimerRef.current);
        soundTimerRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.muted = true;
      }
    } else {
      setIsSoundOn(true);
      if (videoRef.current) {
        videoRef.current.muted = false;
      }
      playSingingBowl();
      soundTimerRef.current = setInterval(() => {
        playSingingBowl();
      }, 8500);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const moveStory = (direction: -1 | 1) => {
    setActiveStory((current) => (current + direction + stories.length) % stories.length);
  };

  // Sync video play state on story change
  useEffect(() => {
    if (videoRef.current && isPlaying) {
      videoRef.current.play().catch(() => {});
    }
  }, [activeStory, isPlaying]);

  useEffect(() => {
    return () => {
      if (soundTimerRef.current) clearInterval(soundTimerRef.current);
      if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <section aria-label="Câu chuyện nổi bật của RUNGU" className="relative min-h-[100dvh] overflow-hidden bg-[#24221f] text-white">
      {/* Background Media (Video with Fallback Image) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={story.image}
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.65 }}
          className="absolute inset-0"
        >
          {story.mediaType === "video" ? (
            <video
              ref={videoRef}
              src={story.image}
              poster={story.poster || undefined}
              autoPlay
              muted={!isSoundOn}
              loop
              playsInline
              className="h-full w-full object-cover object-center"
            />
          ) : (
            <Image
              src={story.image}
              alt={story.alt}
              fill
              priority={activeStory === 0}
              sizes="100vw"
              className="object-cover object-center"
            />
          )}
          {/* Aesthetic Zen Dark Gradients */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#171614]/55 via-[#171614]/25 to-[#171614]/85" />
        </motion.div>
      </AnimatePresence>

      {/* Hero Video & Sound Controls (Play/Pause & Sound on/off) */}
      <div className="absolute top-20 right-4 sm:top-auto sm:bottom-8 sm:left-8 lg:left-12 z-30 flex items-center gap-2">
        {story.mediaType === "video" && (
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? "Tạm dừng video" : "Phát video"}
            title={isPlaying ? "Tạm dừng video" : "Phát video"}
            className="group flex items-center gap-2 rounded-full border border-white/30 bg-black/40 sm:bg-white/15 px-3 py-2 text-xs text-white backdrop-blur-md transition-all hover:border-white/60 hover:bg-white/30 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
          >
            {isPlaying ? (
              <>
                <Pause className="h-3.5 w-3.5 text-white group-hover:text-white" />
                <span className="hidden sm:inline font-light text-white">Tạm dừng</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 text-white fill-white" />
                <span className="hidden sm:inline font-light text-white">Phát video</span>
              </>
            )}
          </button>
        )}

        <button
          type="button"
          onClick={toggleSound}
          aria-label={isSoundOn ? "Tắt âm thanh" : "Bật âm thanh chuông thiền"}
          title={isSoundOn ? "Tắt âm thanh" : "Bật âm thanh chuông thiền 432Hz"}
          className={`group flex items-center gap-2 rounded-full border px-3 py-2 text-xs backdrop-blur-md transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#d8b879] ${
            isSoundOn
              ? "border-[#d8b879] bg-[#d8b879]/30 text-[#f7e4c6]"
              : "border-white/30 bg-black/40 sm:bg-white/15 text-white hover:border-white/60 hover:bg-white/30"
          }`}
        >
          {isSoundOn ? (
            <>
              <Volume2 className="h-3.5 w-3.5 text-[#e5caa1] animate-pulse" />
              <span className="hidden sm:inline font-light text-[#f7e4c6]">Chuông thiền 432Hz</span>
            </>
          ) : (
            <>
              <VolumeX className="h-3.5 w-3.5 text-white/90 group-hover:text-white" />
              <span className="hidden sm:inline font-light text-white">Bật âm thanh</span>
            </>
          )}
        </button>
      </div>

      {/* Story Navigation Arrows (Desktop & Tablet) */}
      <button
        type="button"
        onClick={() => moveStory(-1)}
        aria-label="Câu chuyện trước"
        className="hero-arrow hidden sm:flex left-4 sm:left-8 lg:left-16 cursor-pointer"
      >
        <ArrowLeft className="h-7 w-7" strokeWidth={1.2} />
      </button>
      <button
        type="button"
        onClick={() => moveStory(1)}
        aria-label="Câu chuyện tiếp theo"
        className="hero-arrow hidden sm:flex right-4 sm:right-8 lg:left-auto lg:right-16 cursor-pointer"
      >
        <ArrowRight className="h-7 w-7" strokeWidth={1.2} />
      </button>

      {/* Hero Content Overlay - Perfectly Centered on Mobile & Desktop */}
      <div className="relative z-10 flex min-h-[100dvh] items-end justify-center px-5 pb-20 pt-28 text-center sm:pb-20 lg:pb-14">
        <motion.div
          key={story.title}
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl w-full mx-auto flex flex-col items-center justify-center text-center"
        >
          {story.eyebrow ? (
            <p
              style={{ color: "#ffffff" }}
              className="mb-3 text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase !text-white drop-shadow-sm mx-auto"
            >
              {story.eyebrow}
            </p>
          ) : null}
          <h1
            style={{ color: "#ffffff" }}
            className="text-balance text-2xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-normal leading-[1.15] tracking-[-0.03em] !text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)] mx-auto"
          >
            {story.title}
          </h1>
          <p
            style={{ color: "#ffffff" }}
            className="mx-auto mt-4 sm:mt-5 max-w-2xl text-sm sm:text-lg lg:text-xl leading-relaxed !text-white font-light drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]"
          >
            {story.description}
          </p>
          <Link
            href={story.ctaLink}
            className="hero-cta group mt-6 sm:mt-8 inline-flex items-center justify-center gap-2.5 border border-white bg-white px-7 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-sm font-semibold uppercase tracking-[0.16em] !text-black transition-all hover:border-[#f3f1eb] hover:bg-[#f3f1eb] hover:!text-black shadow-lg mx-auto"
          >
            <span className="!text-black font-semibold">{story.cta}</span>
            <ArrowRight className="h-4 w-4 !text-black transition-transform duration-200 group-hover:translate-x-1" strokeWidth={1.5} />
          </Link>
        </motion.div>

        {/* Story Pagination Indicators */}
        <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 sm:bottom-8" aria-label="Chọn câu chuyện">
          {stories.map((item, index) => (
            <button
              key={item.title}
              type="button"
              onClick={() => setActiveStory(index)}
              aria-label={`Chọn ${item.title}`}
              aria-current={activeStory === index ? "true" : undefined}
              className="p-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white cursor-pointer"
            >
              <span className={`block h-px transition-all duration-300 ${activeStory === index ? "w-10 sm:w-12 bg-white" : "w-5 sm:w-6 bg-white/45 hover:bg-white/70"}`} />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
