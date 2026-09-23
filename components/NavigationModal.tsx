"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronDown, X } from "lucide-react";
import { useCart } from "@/lib/CartContext";

export default function NavigationModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { products, setSelectedCategory } = useCart();
  const [isProductsExpanded, setIsProductsExpanded] = useState(true);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  const categories = useMemo(() => {
    const map = new Map<string, { id: string; label: string; count: number }>();
    map.set("all", { id: "all", label: "Tất cả sản phẩm", count: products.length });
    products.forEach((p) => {
      if (!map.has(p.category)) {
        map.set(p.category, { id: p.category, label: p.categoryName || p.category, count: 1 });
      } else {
        map.get(p.category)!.count += 1;
      }
    });
    return Array.from(map.values());
  }, [products]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-[#f3f1eb] p-6 text-[#282723] sm:p-10 lg:p-14">
          <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between border-b border-[#282723]/15 pb-6">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#77736b]">Menu điều hướng</span>
            <Link href="/" onClick={onClose} className="text-3xl font-normal tracking-[0.18em]">RUNGU</Link>
            <button type="button" onClick={onClose} className="flex items-center gap-2 border border-[#282723]/25 px-4 py-2 text-sm font-medium transition-colors hover:border-[#282723] cursor-pointer" aria-label="Đóng menu"><X className="h-4 w-4" strokeWidth={1.25} />Đóng</button>
          </div>

          <nav aria-label="Menu mở rộng" className="mx-auto my-auto w-full max-w-3xl py-6 sm:py-10">
            {/* 1. Sản phẩm & Các danh mục */}
            <div className="border-b border-[#282723]/15 py-3 sm:py-5">
              <div className="flex w-full items-center justify-between">
                <Link
                  href="/san-pham"
                  onClick={onClose}
                  className="block text-xl font-normal tracking-[-0.03em] transition-colors hover:text-[#9d753d] sm:text-3xl"
                >
                  Sản phẩm
                  <span className="mt-0.5 block text-xs sm:text-sm text-[#77736b]">Khám phá tất cả vật phẩm mộc & hương thơm</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setIsProductsExpanded(!isProductsExpanded)}
                  aria-label="Mở rộng danh mục"
                  className="p-2 text-[#77736b] hover:text-[#282723] cursor-pointer"
                >
                  <ChevronDown className={`h-5 w-5 sm:h-6 sm:w-6 transition-transform duration-300 ${isProductsExpanded ? "rotate-180 text-[#9d753d]" : ""}`} strokeWidth={1.5} />
                </button>
              </div>

              <AnimatePresence>
                {isProductsExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 grid grid-cols-1 gap-2 border-t border-[#282723]/10 pt-3 sm:grid-cols-2">
                      {categories.map((cat) => (
                        <Link
                          key={cat.id}
                          href={cat.id === "all" ? "/san-pham" : `/san-pham?category=${cat.id}`}
                          onClick={() => {
                            setSelectedCategory(cat.id);
                            onClose();
                          }}
                          className="group flex items-center justify-between rounded-lg bg-[#ece7dd]/60 px-3.5 py-2.5 text-left transition-colors hover:bg-[#ece7dd]"
                        >
                          <div>
                            <span className="text-sm sm:text-base font-semibold tracking-tight text-[#282723] group-hover:text-[#9d753d]">{cat.label}</span>
                            <span className="ml-2 text-xs sm:text-sm text-[#77736b]">({cat.count})</span>
                          </div>
                          <ArrowRight className="h-4 w-4 text-[#77736b] transition-transform duration-200 group-hover:translate-x-1 group-hover:text-[#9d753d]" strokeWidth={1.25} />
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 2. Sáng tạo */}
            <Link
              href="/san-pham?category=sang-tao"
              onClick={onClose}
              className="group flex w-full items-center justify-between border-b border-[#282723]/15 py-3.5 sm:py-5 text-left transition-colors hover:border-[#282723]/45"
            >
              <div>
                <span className="block text-xl font-normal tracking-[-0.03em] sm:text-3xl">Sáng tạo</span>
                <span className="mt-0.5 block text-xs sm:text-sm text-[#77736b]">Tác phẩm nghệ nhân và sáng tạo độc bản</span>
              </div>
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-[#77736b] transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[#9d753d]" strokeWidth={1.25} />
            </Link>

            {/* 3. Hương thơm */}
            <Link
              href="/san-pham?category=huong-thom"
              onClick={onClose}
              className="group flex w-full items-center justify-between border-b border-[#282723]/15 py-3.5 sm:py-5 text-left transition-colors hover:border-[#282723]/45"
            >
              <div>
                <span className="block text-xl font-normal tracking-[-0.03em] sm:text-3xl">Hương thơm</span>
                <span className="mt-0.5 block text-xs sm:text-sm text-[#77736b]">Nến thơm tự nhiên và xô thơm thảo mộc</span>
              </div>
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-[#77736b] transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[#9d753d]" strokeWidth={1.25} />
            </Link>

            {/* 4. Gỗ hoa cỏ */}
            <Link
              href="/san-pham?category=go-hoa-co"
              onClick={onClose}
              className="group flex w-full items-center justify-between border-b border-[#282723]/15 py-3.5 sm:py-5 text-left transition-colors hover:border-[#282723]/45"
            >
              <div>
                <span className="block text-xl font-normal tracking-[-0.03em] sm:text-3xl">Gỗ hoa cỏ</span>
                <span className="mt-0.5 block text-xs sm:text-sm text-[#77736b]">Gỗ thánh Palo Santo và trầm nén tự nhiên</span>
              </div>
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-[#77736b] transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[#9d753d]" strokeWidth={1.25} />
            </Link>

            {/* 5. Đất và Đá */}
            <Link
              href="/san-pham?category=dat-va-da"
              onClick={onClose}
              className="group flex w-full items-center justify-between border-b border-[#282723]/15 py-3.5 sm:py-5 text-left transition-colors hover:border-[#282723]/45"
            >
              <div>
                <span className="block text-xl font-normal tracking-[-0.03em] sm:text-3xl">Đất và Đá</span>
                <span className="mt-0.5 block text-xs sm:text-sm text-[#77736b]">Khay gốm thủ công men tro nung củi nhiệt cao</span>
              </div>
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-[#77736b] transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[#9d753d]" strokeWidth={1.25} />
            </Link>

            {/* 6. Phụ kiện */}
            <Link
              href="/san-pham?category=phu-kien"
              onClick={onClose}
              className="group flex w-full items-center justify-between border-b border-[#282723]/15 py-3.5 sm:py-5 text-left transition-colors hover:border-[#282723]/45"
            >
              <div>
                <span className="block text-xl font-normal tracking-[-0.03em] sm:text-3xl">Phụ kiện</span>
                <span className="mt-0.5 block text-xs sm:text-sm text-[#77736b]">Vòng tay bách xanh và dụng cụ nghi thức mộc</span>
              </div>
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-[#77736b] transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[#9d753d]" strokeWidth={1.25} />
            </Link>

            {/* 7. Quà tặng */}
            <Link
              href="/san-pham?category=qua-tang"
              onClick={onClose}
              className="group flex w-full items-center justify-between border-b border-[#282723]/15 py-3.5 sm:py-5 text-left transition-colors hover:border-[#282723]/45"
            >
              <div>
                <span className="block text-xl font-normal tracking-[-0.03em] sm:text-3xl">Quà tặng</span>
                <span className="mt-0.5 block text-xs sm:text-sm text-[#77736b]">Những hộp quà trang nhã gói ghém sự an yên</span>
              </div>
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-[#77736b] transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[#9d753d]" strokeWidth={1.25} />
            </Link>

            {/* 8. Thư viện */}
            <Link
              href="/#stories"
              onClick={onClose}
              className="group flex w-full items-center justify-between border-b border-[#282723]/15 py-3.5 sm:py-5 text-left transition-colors hover:border-[#282723]/45"
            >
              <div>
                <span className="block text-xl font-normal tracking-[-0.03em] sm:text-3xl">Thư viện</span>
                <span className="mt-0.5 block text-xs sm:text-sm text-[#77736b]">Kho lưu trữ những câu chuyện phía sau mùi hương</span>
              </div>
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-[#77736b] transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[#9d753d]" strokeWidth={1.25} />
            </Link>

            {/* 9. Liên hệ */}
            <Link
              href="/#contact"
              onClick={onClose}
              className="group flex w-full items-center justify-between border-b border-[#282723]/15 py-3.5 sm:py-5 text-left transition-colors hover:border-[#282723]/45"
            >
              <div>
                <span className="block text-xl font-normal tracking-[-0.03em] sm:text-3xl">Liên hệ</span>
                <span className="mt-0.5 block text-xs sm:text-sm text-[#77736b]">Cửa hàng tại Hà Nội, hỗ trợ khách hàng và gửi lời nhắn</span>
              </div>
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-[#77736b] transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[#9d753d]" strokeWidth={1.25} />
            </Link>
          </nav>

          <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-2 border-t border-[#282723]/15 pt-5 text-sm text-[#77736b] sm:flex-row sm:items-center sm:justify-between">
            <span>Hương thơm tự nhiên cho những ngày bình thường.</span>
            <span>hello@rungu.vn • 0868 238 690</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
