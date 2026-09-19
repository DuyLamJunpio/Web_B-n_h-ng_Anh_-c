"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { stories } from "@/lib/storyData";

export default function CategoryBand() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isManualPaused, setIsManualPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isEffectivelyPaused = isManualPaused || isHovered;

  const scrollToIndex = useCallback((index: number) => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const cards = container.querySelectorAll<HTMLElement>("[data-story-card]");
    if (cards[index]) {
      const card = cards[index];
      const containerPadding = window.innerWidth >= 1024 ? 48 : window.innerWidth >= 640 ? 32 : 20;
      const targetScrollLeft = card.offsetLeft - container.offsetLeft - containerPadding;
      container.scrollTo({
        left: Math.max(0, targetScrollLeft),
        behavior: "smooth",
      });
      setActiveIndex(index);
    }
  }, []);

  const scrollNext = useCallback(() => {
    setActiveIndex((curr) => {
      const next = (curr + 1) % stories.length;
      scrollToIndex(next);
      return next;
    });
  }, [scrollToIndex]);

  const scrollPrev = useCallback(() => {
    setActiveIndex((curr) => {
      const prev = (curr - 1 + stories.length) % stories.length;
      scrollToIndex(prev);
      return prev;
    });
  }, [scrollToIndex]);

  // Handle scroll event to update active index indicator
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const cards = container.querySelectorAll<HTMLElement>("[data-story-card]");
    if (!cards.length) return;

    const containerLeft = container.getBoundingClientRect().left;
    let closestIndex = 0;
    let minDiff = Infinity;

    cards.forEach((card, idx) => {
      const cardLeft = card.getBoundingClientRect().left;
      const diff = Math.abs(cardLeft - containerLeft);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = idx;
      }
    });

    setActiveIndex(closestIndex);
  }, []);

  // Autoplay timer
  useEffect(() => {
    if (isEffectivelyPaused) return;

    const timer = setInterval(() => {
      scrollNext();
    }, 4000);

    return () => clearInterval(timer);
  }, [isEffectivelyPaused, scrollNext]);

  return (
    <section id="stories" aria-label="Thư viện câu chuyện sản phẩm" className="scroll-mt-24 bg-[#f3f0e8] text-[#282724] overflow-hidden">
      <div className="mx-auto max-w-[1600px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        {/* Section Header */}
        <div className="mb-10 text-center lg:mb-14">
          <p className="mb-4 text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-[#9d753d]">
            Thư viện hương thơm
          </p>
          <h2 className="text-4xl font-medium tracking-[-0.03em] sm:text-5xl lg:text-6xl text-[#282724]">
            Một thư viện của những câu chuyện
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg leading-relaxed text-[#504c44]">
            Mỗi nốt hương là một lát cắt ký ức, mở ra hành trình đánh thức giác quan qua từng nốt hương tự nhiên.
          </p>

          {/* Quick Counter & Prev/Next Controls under subtitle */}
          <div className="mt-7 flex items-center justify-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={scrollPrev}
              aria-label="Xem câu chuyện trước"
              className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-[#282723]/25 bg-white/70 text-[#282724] shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:border-[#282723] hover:scale-105 active:scale-95 cursor-pointer"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <span className="font-mono text-sm font-semibold tracking-wider text-[#504c44] px-1 sm:px-2">
              0{activeIndex + 1} / 0{stories.length}
            </span>

            <button
              type="button"
              onClick={scrollNext}
              aria-label="Xem câu chuyện tiếp theo"
              className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-[#282723]/25 bg-white/70 text-[#282724] shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:border-[#282723] hover:scale-105 active:scale-95 cursor-pointer"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            {/* Play/Pause Button */}
            <button
              type="button"
              onClick={() => setIsManualPaused((prev) => !prev)}
              aria-label={isManualPaused ? "Tiếp tục tự động cuộn" : "Tạm dừng tự động cuộn"}
              className="ml-2 inline-flex items-center gap-1.5 rounded-full border border-[#282723]/20 bg-white/70 px-3 py-2 text-xs font-medium text-[#504c44] backdrop-blur-sm transition-all hover:bg-white hover:text-[#282724] cursor-pointer"
            >
              {isManualPaused ? (
                <>
                  <Play className="h-3.5 w-3.5 fill-current text-[#9d753d]" />
                  <span className="text-xs">Phát tự động</span>
                </>
              ) : (
                <>
                  <Pause className="h-3.5 w-3.5 text-[#9d753d]" />
                  <span className="text-xs">Tạm dừng</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Carousel Viewport with Floating Side Buttons */}
        <div className="relative group/carousel">
          {/* Floating Left Button */}
          <button
            type="button"
            onClick={scrollPrev}
            aria-label="Xem câu chuyện trước"
            className="absolute left-1 sm:left-3 lg:left-4 top-[35%] -translate-y-1/2 z-30 flex h-11 w-11 sm:h-13 sm:w-13 items-center justify-center rounded-full bg-white/85 text-[#282724] shadow-lg backdrop-blur-md border border-[#282723]/15 transition-all duration-300 hover:bg-white hover:scale-110 active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#9d753d]"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          {/* Floating Right Button */}
          <button
            type="button"
            onClick={scrollNext}
            aria-label="Xem câu chuyện tiếp theo"
            className="absolute right-1 sm:right-3 lg:right-4 top-[35%] -translate-y-1/2 z-30 flex h-11 w-11 sm:h-13 sm:w-13 items-center justify-center rounded-full bg-white/85 text-[#282724] shadow-lg backdrop-blur-md border border-[#282723]/15 transition-all duration-300 hover:bg-white hover:scale-110 active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#9d753d]"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Horizontal Scrollable Row */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={() => setIsHovered(true)}
            onTouchEnd={() => {
              setTimeout(() => setIsHovered(false), 2500);
            }}
            className="no-scrollbar flex gap-6 sm:gap-8 overflow-x-auto scroll-smooth snap-x snap-mandatory py-4 -mx-5 px-5 sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12"
          >
            {stories.map((story, index) => (
              <div
                key={story.slug}
                data-story-card
                className="w-[82vw] sm:w-[380px] md:w-[420px] lg:w-[460px] xl:w-[480px] shrink-0 snap-start"
              >
                <Link
                  href={`/story/${story.slug}`}
                  className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9d753d]"
                >
                  {/* Large Image Frame */}
                  <div className="relative aspect-[0.78/1] overflow-hidden rounded-2xl bg-[#ded8cb] shadow-sm transition-shadow duration-500 group-hover:shadow-md">
                    <Image
                      src={story.image}
                      alt={story.imageAlt}
                      fill
                      sizes="(min-width: 1280px) 480px, (min-width: 1024px) 440px, (min-width: 640px) 380px, 85vw"
                      className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                      priority={index < 2}
                    />
                    <span className="absolute left-4 top-4 inline-flex items-center justify-center rounded-full bg-black/40 backdrop-blur-md px-3 py-1 text-xs font-semibold tracking-wider text-white border border-white/20">
                      0{index + 1}
                    </span>
                  </div>

                  {/* Story Content Below Image */}
                  <div className="pt-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9d753d]">
                      {story.product}
                    </p>
                    <h3 className="mt-2 text-2xl sm:text-3xl font-semibold leading-tight tracking-[-0.02em] text-[#282724] transition-colors group-hover:text-[#9d753d]">
                      {story.title}
                    </h3>
                    <p className="mt-2.5 text-base leading-relaxed text-[#504c44] line-clamp-3">
                      {story.detail}
                    </p>
                    <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-[#9d753d] transition-transform duration-300 group-hover:translate-x-1">
                      <span>Khám phá</span>
                      <span>→</span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Indicator Dots Bar */}
        <div className="mt-8 sm:mt-10 flex items-center justify-center gap-2.5">
          {stories.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => scrollToIndex(idx)}
              aria-label={`Chuyển đến câu chuyện ${idx + 1}`}
              className={`h-2 transition-all duration-300 rounded-full cursor-pointer ${
                activeIndex === idx
                  ? "w-9 bg-[#9d753d]"
                  : "w-2.5 bg-[#282723]/25 hover:bg-[#282723]/50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
