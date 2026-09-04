"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Flame, Compass, Heart, MessageSquare, ArrowRight, Phone, Mail } from "lucide-react";

export default function NavigationModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
      document.body.style.overflow = "hidden";
    } else {
      const t = setTimeout(() => setShow(false), 400);
      document.body.style.overflow = "unset";
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  if (!isOpen && !show) return null;

  const links = [
    { href: "#sanctuary-3d", num: "01", label: "Trải Nghiệm 3D Nghi Thức", icon: Sparkles, sub: "Tương tác 360° Palo Santo, nến & khói thơm" },
    { href: "#about", num: "02", label: "Triết Lý Khói & Đất", icon: Compass, sub: "Cội rễ và bản nguyên tĩnh tại" },
    { href: "#collections", num: "03", label: "Vật Phẩm Chữa Lành", icon: Flame, sub: "Palo Santo, xô thơm, nến thơm & trầm" },
    { href: "#quiz", num: "04", label: "Tìm Mùi Hương Của Bạn", icon: Sparkles, sub: "Trắc nghiệm cảm xúc và không gian sống" },
    { href: "#ritual", num: "05", label: "Nghi Thức Thở 4-3-4", icon: Heart, sub: "Nghệ thuật trải nghiệm và tĩnh tâm" },
    { href: "#whispers", num: "06", label: "Cảm Nhận Khách Hàng", icon: MessageSquare, sub: "Những câu chuyện an yên được chia sẻ" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 bg-[#f7f8f4]/98 backdrop-blur-2xl z-50 flex flex-col justify-between p-6 sm:p-12 lg:p-16 overflow-y-auto text-forest-950"
        >
          {/* Top Bar: Brand & Close */}
          <div className="max-w-[1400px] mx-auto w-full grid grid-cols-3 items-center">
            {/* Left Col */}
            <div className="justify-self-start">
              <span className="text-[10px] uppercase tracking-[0.3em] text-forest-700 font-sans font-semibold hidden sm:inline-block">
                Menu Điều Hướng
              </span>
            </div>

            {/* Center Col Logo */}
            <div className="justify-self-center text-center">
              <span className="font-serif text-2xl sm:text-3xl text-forest-950 tracking-[0.25em] block">
                TRẦM & KHÓI
              </span>
              <span className="text-[8px] uppercase tracking-[0.45em] text-forest-700 block -mt-0.5 font-sans font-medium">
                Aura & Rituals
              </span>
            </div>

            {/* Right Col Close Button */}
            <div className="justify-self-end">
              <button
                onClick={onClose}
                className="text-forest-800 hover:text-forest-950 text-xs uppercase tracking-widest px-4 py-2 border border-forest-800/20 hover:border-forest-800 rounded-full transition-all flex items-center gap-2 cursor-pointer bg-white shadow-sm"
              >
                <X className="w-4 h-4" />
                <span>Đóng</span>
              </button>
            </div>
          </div>

          {/* Centered Navigation Links List */}
          <nav className="max-w-3xl mx-auto text-left flex flex-col gap-4 sm:gap-6 my-auto py-8 w-full">
            {links.map((link, idx) => (
              <motion.a
                key={link.href}
                href={link.href}
                onClick={onClose}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 + 0.1, duration: 0.5 }}
                className="group flex items-center justify-between border-b border-forest-800/15 pb-4 transition-all hover:border-forest-800/50 cursor-pointer"
              >
                <div className="flex items-center gap-4 sm:gap-6">
                  <span className="font-serif text-sm sm:text-base text-forest-600 group-hover:text-forest-800 transition-colors font-medium">
                    {link.num}.
                  </span>
                  <div>
                    <span className="font-serif text-2xl sm:text-4xl text-forest-950 group-hover:text-forest-700 transition-colors font-light tracking-wide block">
                      {link.label}
                    </span>
                    <span className="text-xs text-forest-700 font-sans font-light hidden sm:block mt-0.5">
                      {link.sub}
                    </span>
                  </div>
                </div>
                <div className="w-9 h-9 rounded-full border border-forest-800/20 group-hover:border-forest-800 group-hover:bg-forest-100/60 flex items-center justify-center text-forest-700 group-hover:text-forest-950 transition-all bg-white shadow-sm">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </motion.a>
            ))}
          </nav>

          {/* Bottom Bar: Balanced Info */}
          <div className="max-w-[1400px] mx-auto w-full flex flex-col sm:flex-row justify-between items-center text-xs text-forest-700 tracking-widest uppercase gap-4 pt-6 border-t border-forest-800/15">
            <span>Hành trình thanh tẩy không gian & làm dịu tâm trí</span>
            <div className="flex items-center gap-6 text-forest-800 font-medium">
              <span className="flex items-center gap-1.5 text-forest-800">
                <Phone className="w-3.5 h-3.5 text-forest-700" /> 090 123 4567
              </span>
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-forest-700" /> contact@tramvakhoi.vn
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
