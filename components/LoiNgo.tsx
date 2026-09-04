"use client";

import { motion } from "framer-motion";

export default function LoiNgo() {
  return (
    <section className="w-full min-h-[70vh] flex items-center py-20 bg-charcoal overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 lg:px-24 flex flex-col md:flex-row">
        {/* Left: Negative Space */}
        <div className="hidden md:block md:w-1/2"></div>
        
        {/* Right: Content */}
        <div className="w-full md:w-1/2 flex items-center justify-start md:pl-12 lg:pl-24">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="max-w-md"
          >
            <h2 className="font-serif text-3xl md:text-4xl font-light mb-8 text-white/90">
              Triết lý của Khói & Đất
            </h2>
            <p className="font-sans text-lg md:text-xl font-light leading-relaxed text-text-dim italic">
              "Từ những cánh rừng cổ thụ đến cao nguyên lộng gió, chúng tôi mang đến những gì nguyên sơ nhất, để bạn tìm thấy khoảng lặng giữa những bộn bề..."
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
