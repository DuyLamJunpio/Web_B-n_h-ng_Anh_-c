"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { stories } from "@/lib/storyData";

export default function CategoryBand() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);

  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasDraggedRef = useRef(false);

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

  // Mouse drag handlers for desktop
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollContainerRef.current) return;
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    startXRef.current = e.pageX - scrollContainerRef.current.offsetLeft;
    scrollLeftRef.current = scrollContainerRef.current.scrollLeft;
    setIsDragging(true);
    setIsInteracting(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = x - startXRef.current;
    if (Math.abs(walk) > 5) {
      hasDraggedRef.current = true;
    }
    scrollContainerRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      setIsDragging(false);
      setTimeout(() => {
        hasDraggedRef.current = false;
      }, 100);
      setTimeout(() => {
        setIsInteracting(false);
      }, 3000);
    }
  };

  // Touch handlers for mobile
  const handleTouchStart = () => {
    setIsInteracting(true);
  };

  const handleTouchEnd = () => {
    setTimeout(() => {
      setIsInteracting(false);
    }, 3000);
  };

  // Autoplay timer
  useEffect(() => {
    if (isInteracting) return;

    const timer = setInterval(() => {
      scrollNext();
    }, 4000);

    return () => clearInterval(timer);
  }, [isInteracting, scrollNext]);

  return (
    <section id="stories" aria-label="Thư viện câu chuyện sản phẩm" className="scroll-mt-24 bg-[#f3f0e8] text-[#282724] overflow-hidden">
      <div className="mx-auto max-w-[1600px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        {/* Section Header */}
        <div className="mb-10 text-center lg:mb-14">
          <p className="mb-4 text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-[#9d753d]">
            Thư viện hương thơm
          </p>
          <h2 className="text-4xl font-medium tracking-[-0.03em] sm:text-5xl lg:text-6xl text-[#282724]">
            Từng lát cắt của mùi hương
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg leading-relaxed text-[#504c44]">
            Mỗi khoảnh khắc, mỗi nền văn hóa đều có một câu chuyện. Và Ru Ngủ chọn kể lại qua mùi hương của cỏ, cây, hoa, lá.
          </p>
        </div>

        {/* Carousel Viewport */}
        <div className="relative group/carousel">
          {/* Horizontal Scrollable Row */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className={`no-scrollbar flex gap-6 sm:gap-8 overflow-x-auto py-4 -mx-5 px-5 sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12 select-none ${
              isDragging
                ? "cursor-grabbing snap-none"
                : "cursor-grab snap-x snap-mandatory scroll-smooth"
            }`}
          >
            {stories.map((story, index) => (
              <div
                key={story.slug}
                data-story-card
                className="w-[72vw] sm:w-[300px] md:w-[330px] lg:w-[360px] xl:w-[380px] shrink-0 snap-start"
              >
                <Link
                  href={`/story/${story.slug}`}
                  onClick={(e) => {
                    if (hasDraggedRef.current) {
                      e.preventDefault();
                      e.stopPropagation();
                    }
                  }}
                  draggable={false}
                  className="group block select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9d753d]"
                >
                  {/* Story Image Frame - Not rounded, refined size */}
                  <div className="relative aspect-[4/5] overflow-hidden rounded-none bg-[#ded8cb] shadow-sm transition-shadow duration-500 group-hover:shadow-md pointer-events-none">
                    <Image
                      src={story.image}
                      alt={story.imageAlt}
                      fill
                      draggable={false}
                      sizes="(min-width: 1280px) 380px, (min-width: 1024px) 360px, (min-width: 640px) 300px, 75vw"
                      className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.05] pointer-events-none select-none"
                      priority={index < 2}
                    />
                    <span className="absolute left-4 top-4 inline-flex items-center justify-center rounded-full bg-black/40 backdrop-blur-md px-3 py-1 text-xs font-semibold tracking-wider text-white border border-white/20">
                      0{index + 1}
                    </span>
                  </div>

                  {/* Story Content Below Image */}
                  <div className="pt-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9d753d]">
                      {story.product}
                    </p>
                    <h3 className="mt-2 text-xl sm:text-2xl font-semibold leading-tight tracking-[-0.02em] text-[#282724] transition-colors group-hover:text-[#9d753d]">
                      {story.title}
                    </h3>
                    <p className="mt-2.5 text-sm sm:text-base leading-relaxed text-[#504c44] line-clamp-3">
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
