"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export default function About() {
  return (
    <section id="about" className="bg-[#e8e4da] px-5 py-20 text-[#282723] sm:px-8 sm:py-28 lg:px-12">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-20">
        <motion.div initial={{ opacity: 0, x: -18 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.65 }}>
          <h2 className="max-w-xl text-4xl font-light leading-[1.05] tracking-[-0.045em] sm:text-5xl lg:text-6xl">Từ rừng già đến khoảng trời bình yên của bạn</h2>
          <p className="mt-7 max-w-lg text-sm leading-6 text-[#5e5a52] sm:text-base">RUNGU chọn những vật phẩm tự nhiên có câu chuyện rõ ràng, rồi đưa chúng về gần hơn với nhịp sống hàng ngày.</p>
          <p className="mt-4 max-w-lg text-sm leading-6 text-[#5e5a52] sm:text-base">Không tẩm ướp hương liệu tổng hợp. Không làm quá nghi thức. Chỉ là gỗ, khói và một căn phòng được chăm sóc.</p>
          <a href="#collections" className="mt-8 inline-flex items-center gap-2 border-b border-[#282723] pb-1 text-sm transition-colors hover:text-[#8d693a]">Đọc câu chuyện của chúng tôi <ArrowUpRight className="h-4 w-4" strokeWidth={1.25} /></a>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.7 }} className="relative min-h-[420px] overflow-hidden bg-[#2b2925] sm:min-h-[560px]">
          <Image src="/videos/palo-santo-poster.jpg" alt="Khói thơm trong một không gian yên tĩnh" fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover object-center opacity-90 transition-transform duration-700 hover:scale-[1.03]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#201f1c]/75 via-transparent to-transparent" />
          <p className="absolute bottom-6 left-6 max-w-xs text-sm leading-6 text-white sm:bottom-8 sm:left-8">Mỗi món đồ được chọn để dùng được, chạm được và sống cùng bạn.</p>
        </motion.div>
      </div>
    </section>
  );
}
