"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function NaturalIngredients() {
  const handleScrollToStory = () => {
    const section = document.getElementById("featured-story-video");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="natural-ingredients"
      aria-label="100% nguyên liệu tự nhiên"
      className="border-b border-[#282723]/15 bg-[#fffef2] text-[#24231f] overflow-hidden"
    >
      <div className="mx-auto max-w-[1720px] px-6 py-14 sm:px-10 sm:py-20 lg:px-16 lg:py-24 xl:px-20 xl:py-28">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14 xl:gap-20">
          {/* ============================================================ */}
          {/* LEFT COLUMN: Editorial Typography & Aesop CTA Button         */}
          {/* ============================================================ */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex flex-col items-start justify-center lg:col-span-5"
          >
            {/* Chữ lớn (Heading) */}
            <h2 className="text-2xl sm:text-3xl lg:text-[2.25rem] xl:text-[2.65rem] font-normal leading-[1.25] tracking-[-0.025em] text-[#24231f]">
              100% nguyên liệu tự nhiên mang đến cho bạn sự an yên
            </h2>

            {/* Chữ nhỏ (Description) */}
            <p className="mt-5 sm:mt-6 text-base sm:text-lg leading-relaxed text-[#555149] max-w-xl">
              Ru Ngủ tạo nên những sản phẩm chất lượng từ thiên nhiên. Sáng tạo nên những phong cách sống mới trong thế giới hiện đại.
            </p>

            {/* Aesop-style Rectangular CTA Button */}
            <div className="mt-8 sm:mt-10">
              <button
                type="button"
                onClick={handleScrollToStory}
                className="group inline-flex items-center justify-between gap-8 border border-[#24231f]/25 bg-transparent px-6 py-4 text-sm font-medium tracking-wide text-[#24231f] transition-all duration-300 hover:border-[#24231f] hover:bg-[#24231f] hover:text-[#fffef2] active:scale-[0.99] cursor-pointer"
              >
                <span>Khám phá các nốt hương tự nhiên</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
              </button>
            </div>
          </motion.div>

          {/* ============================================================ */}
          {/* RIGHT COLUMN: Natural Ingredients Visual Showcase (Ảnh 2)   */}
          {/* ============================================================ */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.75, delay: 0.15, ease: "easeOut" }}
            className="lg:col-span-7 w-full"
          >
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#e8e4da] shadow-sm">
              <Image
                src="/images/natural-ingredients.jpg"
                alt="100% nguyên liệu tự nhiên - Ru Ngủ"
                fill
                priority
                sizes="(min-width: 1536px) 58vw, (min-width: 1024px) 55vw, 100vw"
                className="object-cover object-center transition-transform duration-700 ease-out hover:scale-[1.015]"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
