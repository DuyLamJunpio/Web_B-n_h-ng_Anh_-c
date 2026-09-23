"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronDown, X } from "lucide-react";
import { PRIMARY_CATEGORY_SLUGS, useCart } from "@/lib/CartContext";
import { countProductsInCategory } from "@/lib/categoryFilters";
import type { StorefrontCategory } from "@/lib/catalog";

export default function NavigationModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { products, categories, setSelectedCategory } = useCart();
  const [isProductsExpanded, setIsProductsExpanded] = useState(true);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  const menuCategories = useMemo(() => [
    { id: "all", label: "Tất cả sản phẩm", count: products.length, isChild: false },
    ...categories.map((category) => ({
      id: category.slug,
      label: category.name,
      count: countProductsInCategory(products, categories, category.slug),
      isChild: category.parent_id !== null,
    })),
  ], [products, categories]);

  const primaryCategories = useMemo(() =>
    PRIMARY_CATEGORY_SLUGS
      .map((slug) => categories.find((category) => category.slug === slug))
      .filter((category): category is StorefrontCategory => Boolean(category)),
  [categories]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-[#f3f1eb] p-5 sm:p-10 lg:p-14 text-[#282723]">
          <div className="relative mx-auto flex w-full max-w-[1400px] items-center justify-between border-b border-[#282723]/15 pb-4 sm:pb-6">
            <span className="hidden sm:inline text-xs font-semibold uppercase tracking-[0.18em] text-[#77736b]">Menu điều hướng</span>
            <Link href="/" onClick={onClose} className="text-2xl sm:text-3xl font-normal tracking-[0.18em] absolute left-1/2 -translate-x-1/2">RUNGU</Link>
            <button type="button" onClick={onClose} className="flex items-center gap-1.5 sm:gap-2 border border-[#282723]/25 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium transition-colors hover:border-[#282723] cursor-pointer ml-auto" aria-label="Đóng menu"><X className="h-4 w-4" strokeWidth={1.25} />Đóng</button>
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
                      {menuCategories.map((cat) => (
                        <Link
                          key={cat.id}
                          href={cat.id === "all" ? "/san-pham" : `/san-pham?category=${cat.id}`}
                          onClick={() => {
                            setSelectedCategory(cat.id);
                            onClose();
                          }}
                          className={`group flex items-center justify-between rounded-lg bg-[#ece7dd]/60 py-2.5 pr-3.5 text-left transition-colors hover:bg-[#ece7dd] ${cat.isChild ? "pl-6" : "pl-3.5"}`}
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

            {primaryCategories.map((category) => (
              <Link
                key={category.slug}
                href={`/san-pham?category=${encodeURIComponent(category.slug)}`}
                onClick={() => {
                  setSelectedCategory(category.slug);
                  onClose();
                }}
                className="group flex w-full items-center justify-between border-b border-[#282723]/15 py-3.5 sm:py-5 text-left transition-colors hover:border-[#282723]/45"
              >
                <div>
                  <span className="block text-xl font-normal tracking-[-0.03em] sm:text-3xl">{category.name}</span>
                  {category.description && (
                    <span className="mt-0.5 block text-xs sm:text-sm text-[#77736b]">{category.description}</span>
                  )}
                </div>
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-[#77736b] transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[#9d753d]" strokeWidth={1.25} />
              </Link>
            ))}
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

          <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-2 border-t border-[#282723]/15 pt-5 text-xs sm:text-sm text-[#77736b] text-center sm:text-left sm:flex-row sm:items-center sm:justify-between">
            <span>Hương thơm tự nhiên cho những ngày bình thường.</span>
            <span>hello@rungu.vn • 0868 238 690</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
