"use client";

import { motion } from "framer-motion";
import { Sparkles, Leaf, Compass, Shield, Wind, CheckCircle2 } from "lucide-react";

export default function About() {
  return (
    <section id="about" className="py-28 sm:py-36 px-4 sm:px-8 lg:px-12 xl:px-16 max-w-[1400px] mx-auto relative overflow-hidden bg-linen-base">
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-forest-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Column: Visual Composition with Ethereal Lighting */}
        <motion.div
          initial={{ opacity: 0, x: -40, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 relative"
        >
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-forest-800/15 group shadow-xl">
            {/* Background Story Image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80&w=1000"
              alt="Triết lý khói và đất"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 filter brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-950/85 via-forest-900/35 to-transparent"></div>

            {/* Floating Quote Over Image */}
            <div className="absolute inset-0 p-8 sm:p-10 flex flex-col justify-between z-10">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-lg">
                <Sparkles className="w-5 h-5 text-emerald-200" />
              </div>

              <div className="space-y-4">
                <span className="text-emerald-300 text-5xl font-serif leading-none block">“</span>
                <p className="font-serif text-2xl sm:text-3xl text-white font-light leading-snug italic drop-shadow-md descender-safe">
                  Khói không giữ hình dạng. Khói cuốn đi những điều nặng trĩu, chỉ để lại sự thuần khiết nguyên bản.
                </p>
                <div className="pt-4 border-t border-white/20 flex justify-between items-center text-xs text-stone-200 tracking-widest uppercase font-medium">
                  <span>Bản Nguyên Tĩnh Tại</span>
                  <span className="text-emerald-300 font-semibold tracking-wider">Triết Lý Thủ Công</span>
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Floating Mini Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden sm:flex absolute -bottom-6 -right-6 bg-white/95 backdrop-blur-md border border-forest-800/15 p-4 sm:p-5 rounded-xl shadow-xl max-w-xs items-center gap-4 z-20"
          >
            <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 border border-forest-800/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=200"
                alt="Palo Santo Craft"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="text-[10px] text-forest-700 uppercase tracking-widest block font-bold">Bảo Tồn Rừng</span>
              <span className="text-xs text-forest-900 font-serif leading-tight block mt-0.5 font-medium">Chỉ thu hoạch từ cành gỗ tự rụng sau 4-10 năm</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Column: Narrative Content */}
        <motion.div
          initial={{ opacity: 0, x: 40, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7 space-y-8 lg:pl-4"
        >
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-forest-700 text-xs tracking-[0.3em] uppercase font-semibold">
              <Leaf className="w-3.5 h-3.5 text-forest-600" />
              <span>Cội Rễ Thô Mộc & An Yên</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-forest-950 font-light leading-tight descender-safe">
              Từ những cánh rừng cổ thụ đến khoảng trời bình yên của bạn.
            </h2>
          </div>

          <p className="text-forest-800/85 font-light leading-relaxed text-base sm:text-lg max-w-[65ch]">
            Mỗi thanh gỗ thánh <strong className="text-forest-950 font-medium">Palo Santo</strong> thu hoạch tự nhiên từ những cành tự rụng sau hàng năm trời phơi mình dưới nắng gió Nam Mỹ, hay mỗi bó <strong className="text-forest-950 font-medium">Xô Thơm Trắng</strong> đều chứa đựng nguồn năng lượng thanh tĩnh của đất trời. Chúng tôi giữ trọn sự mộc mạc nguyên bản: không hương liệu tổng hợp, không tẩm ướp hóa chất.
          </p>

          <p className="text-forest-800/75 font-light leading-relaxed text-base sm:text-lg max-w-[65ch]">
            Khi ngọn lửa chạm vào thanh gỗ và làn khói mỏng manh bắt đầu uốn lượn, căn phòng của bạn lắng lại một nhịp chậm rãi, nhường chỗ cho sự an yên sâu thẳm trong từng hơi thở.
          </p>

          {/* Asymmetric Bento Grid replacing the 3 equal cards cliché */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 pt-6 border-t border-forest-800/15">
            {/* Major Card (7 cols - Golden Ratio) */}
            <div className="sm:col-span-7 p-6 sm:p-7 rounded-2xl bg-white/90 border border-forest-800/15 hover:border-forest-700 transition-all duration-300 flex flex-col justify-between space-y-4 shadow-sm group">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-forest-700 font-mono uppercase tracking-widest font-semibold">Khai Thác Bền Vững</span>
                  <Shield className="w-4 h-4 text-forest-600 group-hover:text-forest-800 transition-colors" />
                </div>
                <h4 className="font-serif text-2xl text-forest-950 font-light descender-safe">
                  4 - 10 Năm Phơi Nắng Gió Andes
                </h4>
                <p className="text-forest-800/80 text-xs font-light leading-relaxed">
                  Tuân thủ nghiêm ngặt tiêu chuẩn bảo tồn rừng Peru (SERFOR). Tinh dầu và năng lượng thanh tẩy chỉ đạt đến độ chín muồi khi thân cây tự phân hủy tự nhiên trong rừng già.
                </p>
              </div>
              <div className="pt-3 border-t border-forest-800/10 flex items-center justify-between text-[11px] text-forest-700 font-mono">
                <span>CHỨNG NHẬN SERFOR</span>
                <span className="text-forest-800 font-bold">100% GỖ TỰ RỤNG</span>
              </div>
            </div>

            {/* Minor Stacked Column (5 cols - 2 Cards) */}
            <div className="sm:col-span-5 flex flex-col gap-4">
              <div className="p-5 rounded-2xl bg-white/80 border border-forest-800/15 hover:border-forest-700 transition-all duration-300 shadow-sm">
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-xl text-forest-800 font-bold">432 Hz</span>
                  <Sparkles className="w-3.5 h-3.5 text-forest-600" />
                </div>
                <h4 className="text-forest-950 text-xs uppercase tracking-wider font-semibold mt-1">Năng Lượng Tĩnh</h4>
                <p className="text-forest-800/80 text-[11px] font-light mt-1 leading-relaxed">
                  Mỗi kiện hàng đều được xông trầm thơm dịu và chúc phúc an lành cùng chuông xoay.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/80 border border-forest-800/15 hover:border-forest-700 transition-all duration-300 shadow-sm">
                <div className="flex items-baseline justify-between">
                  <span className="text-[11px] text-forest-700 font-mono uppercase tracking-widest font-semibold">Đóng Gói Mộc</span>
                  <Wind className="w-3.5 h-3.5 text-forest-600" />
                </div>
                <h4 className="text-forest-950 text-xs uppercase tracking-wider font-semibold mt-1">Bảo Vệ Môi Trường</h4>
                <p className="text-forest-800/80 text-[11px] font-light mt-1 leading-relaxed">
                  Giấy mộc tái chế, không màng nilon bóng, bảo tồn trọn vẹn sự thuần khiết.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
