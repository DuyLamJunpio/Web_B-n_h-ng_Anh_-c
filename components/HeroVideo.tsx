"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

const stories = [
  {
    eyebrow: "Bộ sưu tập mới",
    title: "Hương thơm cho những ngày bình thường",
    description: "Những vật phẩm mộc để căn phòng trở nên nhẹ nhõm hơn.",
    cta: "Khám phá bộ sưu tập",
    image: "/generated-hero.png",
    alt: "Chai hương amber giữa gỗ và hoa trắng",
  },
  {
    eyebrow: "Nghi thức tại nhà",
    title: "Một khoảng lặng vừa đủ",
    description: "Chạm vào gỗ, lửa và những nốt hương nguyên bản.",
    cta: "Xem vật phẩm",
    image: "/videos/palo-santo-poster.jpg",
    alt: "Palo Santo và khói thơm trong không gian tối",
  },
] as const;

export default function HeroVideo() {
  const [activeStory, setActiveStory] = useState(0);
  const reduceMotion = useReducedMotion();
  const story = stories[activeStory];

  const moveStory = (direction: -1 | 1) => {
    setActiveStory((current) => (current + direction + stories.length) % stories.length);
  };

  return (
    <section aria-label="Câu chuyện nổi bật của RUNGU" className="relative min-h-[100dvh] overflow-hidden bg-[#24221f] text-white">
      <AnimatePresence mode="wait">
        <motion.div
          key={story.image}
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.65 }}
          className="absolute inset-0"
        >
          {activeStory === 0 ? (
            <Image src={story.image} alt={story.alt} fill priority sizes="100vw" className="object-cover object-center" />
          ) : (
            // This poster is local so the second story stays reliable during offline development.
            <Image src={story.image} alt={story.alt} fill sizes="100vw" className="object-cover object-center" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-[#171614]/45 via-[#171614]/10 to-[#171614]/85" />
        </motion.div>
      </AnimatePresence>

      <button type="button" onClick={() => moveStory(-1)} aria-label="Câu chuyện trước" className="hero-arrow left-4 sm:left-8 lg:left-16">
        <ArrowLeft className="h-7 w-7" strokeWidth={1.2} />
      </button>
      <button type="button" onClick={() => moveStory(1)} aria-label="Câu chuyện tiếp theo" className="hero-arrow right-4 sm:right-8 lg:right-16">
        <ArrowRight className="h-7 w-7" strokeWidth={1.2} />
      </button>

      <div className="relative z-10 flex min-h-[100dvh] items-end justify-center px-6 pb-16 pt-40 text-center sm:pb-20 lg:pb-14">
        <motion.div
          key={story.title}
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl"
        >
          <p className="text-[11px] font-medium tracking-[0.08em] text-white/90">{story.eyebrow}</p>
          <h1 className="mt-3 text-balance text-4xl font-light leading-[1.05] tracking-[-0.04em] sm:text-5xl lg:text-6xl">{story.title}</h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/85">{story.description}</p>
          <a href="#collections" className="hero-cta mt-7">{story.cta}<ArrowRight className="h-4 w-4" strokeWidth={1.25} /></a>
        </motion.div>

        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2 sm:bottom-8" aria-label="Chọn câu chuyện">
          {stories.map((item, index) => (
            <button key={item.title} type="button" onClick={() => setActiveStory(index)} aria-label={`Chọn ${item.title}`} aria-current={activeStory === index ? "true" : undefined} className="p-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white">
              <span className={`block h-px transition-all duration-300 ${activeStory === index ? "w-12 bg-white" : "w-6 bg-white/50"}`} />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
