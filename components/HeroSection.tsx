"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function HeroSection() {
  const heading = "Trở về với sự tĩnh tại.";
  const words = heading.split(" ");

  return (
    <section className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center">
      {/* Background Video (Placeholder) */}
      <div className="absolute inset-0 z-0 bg-black/60">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-60"
        >
          {/* Using a placeholder abstract smoke video */}
          <source src="https://cdn.pixabay.com/video/2020/05/25/40141-426581971_large.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-charcoal"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-3xl">
        <h1 className="font-serif text-5xl md:text-7xl font-light tracking-wide mb-6">
          {words.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, filter: "blur(10px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{
                duration: 1.5,
                delay: i * 0.4,
                ease: "easeOut",
              }}
              className="inline-block mr-3 md:mr-4"
            >
              {word}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2.5 }}
          className="font-sans text-sm md:text-base font-light text-text-dim mb-12 tracking-wider max-w-lg"
        >
          Hành trình thanh tẩy không gian và chữa lành tâm trí qua những tạo tác từ thiên nhiên.
        </motion.p>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 3 }}
          className="px-8 py-3 rounded-full border border-white/50 text-white text-sm tracking-widest uppercase transition-all duration-500 hover:border-amber hover:text-amber hover:shadow-[0_0_15px_rgba(255,191,0,0.3)]"
        >
          Bắt đầu hành trình
        </motion.button>
      </div>

      {/* Bouncing Arrow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 4 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-6 h-6 text-white/50" strokeWidth={1} />
        </motion.div>
      </motion.div>
    </section>
  );
}
