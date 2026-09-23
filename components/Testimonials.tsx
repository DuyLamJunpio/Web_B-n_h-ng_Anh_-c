"use client";

import { motion } from "framer-motion";
import { TESTIMONIALS } from "@/lib/data";
import { Star, Quote } from "lucide-react";

export default function Testimonials() {
  const featured = TESTIMONIALS[0];
  const sideTestimonials = TESTIMONIALS.slice(1);

  return (
    <section id="whispers" className="py-28 sm:py-36 px-4 sm:px-8 lg:px-12 xl:px-16 max-w-[1400px] mx-auto relative overflow-hidden">
      {/* Subtle Natural Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sage-mist/40 rounded-full blur-[140px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.8 }}
        className="space-y-4 max-w-3xl mb-16 text-center sm:text-left mx-auto sm:mx-0 flex flex-col items-center sm:items-start"
      >
        <div className="inline-flex items-center gap-2 text-forest-700 text-xs tracking-[0.3em] uppercase font-mono font-semibold">
          <Quote className="w-3.5 h-3.5" />
          <span>Cảm nhận đồng điệu</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-forest-950 font-light leading-tight descender-safe">
          Lời thì thầm của sự an yên
        </h2>
        <p className="text-forest-800/80 font-light text-sm sm:text-base leading-relaxed max-w-[65ch]">
          Những sẻ chia chân thực từ những tâm hồn đã chọn đồng hành cùng Trầm & Khói trên hành trình nuôi dưỡng sự tĩnh tại.
        </p>
      </motion.div>

      {/* Asymmetric Editorial Grid (7:5 Ratio replacing the 3 equal cards cliché) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch text-center sm:text-left">
        {/* Major Featured Testimonial (7 Columns) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-7 p-8 sm:p-12 bg-white/75 border border-forest-800/15 hover:border-forest-800/30 transition-all duration-300 flex flex-col justify-between space-y-8 relative group"
        >
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-2">
              <div className="flex gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                ))}
              </div>
              <span className="text-[11px] font-mono text-forest-700 tracking-widest uppercase font-semibold">
                TRẢI NGHIỆM THỰC TẾ
              </span>
            </div>

            <p className="font-serif text-2xl sm:text-3xl lg:text-4xl text-forest-950 font-light leading-relaxed italic descender-safe">
              “{featured.quote}”
            </p>
          </div>

          <div className="pt-6 border-t border-forest-800/10 flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={featured.avatar}
                alt={featured.author}
                className="w-14 h-14 rounded-none object-cover border border-forest-800/20"
              />
              <div>
                <span className="text-base font-medium tracking-wide text-forest-950 block">
                  {featured.author}
                </span>
                <span className="text-xs text-forest-700 block font-sans mt-0.5">
                  {featured.role}
                </span>
              </div>
            </div>

            <span className="text-xs text-forest-800 font-serif italic px-3.5 py-1.5 bg-forest-50 border border-forest-800/20">
              ✦ {featured.product}
            </span>
          </div>
        </motion.div>

        {/* Side Stacked Testimonials (5 Columns) */}
        <div className="lg:col-span-5 flex flex-col gap-6 justify-between">
          {sideTestimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, delay: (idx + 1) * 0.15 }}
              className="p-6 sm:p-7 bg-white/65 border border-forest-800/10 hover:border-forest-800/25 transition-all duration-300 flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-2">
                  <div className="flex gap-1 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                  <Quote className="w-5 h-5 text-forest-700/30 group-hover:text-forest-700/60 transition-colors" />
                </div>

                <p className="font-serif italic text-base sm:text-lg text-forest-900 font-light leading-relaxed descender-safe">
                  “{t.quote}”
                </p>
              </div>

              <div className="pt-4 border-t border-forest-800/10 flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-3 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={t.avatar}
                    alt={t.author}
                    className="w-10 h-10 rounded-none object-cover border border-forest-800/20"
                  />
                  <div>
                    <span className="text-xs font-medium text-forest-950 block">
                      {t.author}
                    </span>
                    <span className="text-[11px] text-forest-700 block">
                      {t.role}
                    </span>
                  </div>
                </div>

                <span className="text-[11px] text-forest-700 font-serif italic">
                  ✦ {t.product}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
