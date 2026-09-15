"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, X } from "lucide-react";

const links = [
  { href: "#collections", label: "Bộ sưu tập", sub: "Gỗ Palo Santo, nến thơm và nhang trầm" },
  { href: "#about", label: "Về RUNGU", sub: "Câu chuyện phía sau những vật phẩm tự nhiên" },
  { href: "#collections", label: "Vật phẩm mới", sub: "Những lựa chọn vừa về trong tháng này" },
  { href: "#about", label: "Cửa hàng và hỗ trợ", sub: "Tìm chúng tôi tại Hà Nội hoặc gửi lời nhắn" },
];

export default function NavigationModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-[#f3f1eb] p-6 text-[#282723] sm:p-10 lg:p-14">
          <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between border-b border-[#282723]/15 pb-6">
            <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#77736b]">Menu điều hướng</span>
            <span className="text-2xl font-light tracking-[0.18em]">RUNGU</span>
            <button type="button" onClick={onClose} className="flex items-center gap-2 border border-[#282723]/25 px-4 py-2 text-xs transition-colors hover:border-[#282723]" aria-label="Đóng menu"><X className="h-4 w-4" strokeWidth={1.25} />Đóng</button>
          </div>

          <nav aria-label="Menu mở rộng" className="mx-auto my-auto w-full max-w-4xl py-12">
            {links.map((link, index) => (
              <motion.a key={`${link.label}-${index}`} href={link.href} onClick={onClose} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 + 0.1, duration: 0.45 }} className="group flex items-center justify-between border-b border-[#282723]/15 py-6 transition-colors hover:border-[#282723]/45 sm:py-8">
                <span><span className="block text-2xl font-light tracking-[-0.03em] sm:text-4xl">{link.label}</span><span className="mt-1 block text-xs text-[#77736b]">{link.sub}</span></span>
                <ArrowRight className="h-5 w-5 text-[#77736b] transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[#8d693a]" strokeWidth={1.25} />
              </motion.a>
            ))}
          </nav>

          <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-2 border-t border-[#282723]/15 pt-5 text-xs text-[#77736b] sm:flex-row sm:items-center sm:justify-between">
            <span>Hương thơm tự nhiên cho những ngày bình thường.</span>
            <span>hello@rungu.vn</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
