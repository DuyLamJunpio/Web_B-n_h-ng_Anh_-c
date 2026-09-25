"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ShoppingBag, Check, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/CartContext";
import type { Product } from "@/lib/data";

export default function FeaturedProducts() {
  const { products, addToCart, openProductModal, setCartOpen } = useCart();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [addedId, setAddedId] = useState<string | null>(null);

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product.id);
    setAddedId(product.id);
    window.setTimeout(() => setAddedId(null), 1600);
  };

  const handleBuyNow = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product.id);
    setCartOpen(true);
  };

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const maxScroll = scrollWidth - clientWidth;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < maxScroll - 10);
    if (maxScroll > 0) {
      setScrollProgress(Math.min(1, Math.max(0, scrollLeft / maxScroll)));
    }
  }, []);

  useEffect(() => {
    handleScroll();
    window.addEventListener("resize", handleScroll);
    return () => window.removeEventListener("resize", handleScroll);
  }, [handleScroll]);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const cardWidth = container.querySelector<HTMLElement>("[data-product-card]")?.offsetWidth || 360;
    const scrollAmount = cardWidth + 36;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section
      id="featured-products"
      aria-label="Bộ sưu tập nổi bật từ RUNGU"
      className="border-b border-[#282723]/15 bg-[#fffdfa] text-[#24231f] py-20 sm:py-24 lg:py-28 overflow-hidden select-none"
    >
      <div className="mx-auto max-w-[1720px] px-6 sm:px-10 lg:px-16 xl:px-20">
        {/* ============================================================ */}
        {/* CENTERED HEADER: Aesop-Style Refined Typography               */}
        {/* ============================================================ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto mb-14 sm:mb-18 lg:mb-20"
        >
          {/* Chữ to */}
          <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-normal leading-[1.2] tracking-[-0.03em] text-[#24231f]">
            Bộ sưu tập nổi bật từ RUNGU
          </h2>

          {/* Chữ nhỏ */}
          <p className="mt-4 sm:mt-5 text-base sm:text-lg leading-relaxed text-[#5a554c] max-w-2xl mx-auto">
            Những sản phẩm sáng tạo, chất lượng từ thiên nhiên làm bạn say mê
          </p>
        </motion.div>

        {/* ============================================================ */}
        {/* CAROUSEL VIEWPORT: 3 Cards per view (Desktop) & Swipe (Mobile)*/}
        {/* ============================================================ */}
        <div className="relative group/carousel">
          {/* Left Arrow Button */}
          {canScrollLeft && (
            <button
              type="button"
              onClick={() => scroll("left")}
              aria-label="Xem sản phẩm trước"
              className="absolute -left-2 sm:-left-4 lg:-left-6 top-[38%] -translate-y-1/2 z-20 hidden sm:flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/95 text-[#24231f] shadow-lg border border-[#282723]/10 backdrop-blur-md transition-all duration-300 hover:bg-[#24231f] hover:text-white hover:scale-105 active:scale-95 cursor-pointer"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
            </button>
          )}

          {/* Right Arrow Button */}
          {canScrollRight && (
            <button
              type="button"
              onClick={() => scroll("right")}
              aria-label="Xem sản phẩm tiếp theo"
              className="absolute -right-2 sm:-right-4 lg:-right-6 top-[38%] -translate-y-1/2 z-20 hidden sm:flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/95 text-[#24231f] shadow-lg border border-[#282723]/10 backdrop-blur-md transition-all duration-300 hover:bg-[#24231f] hover:text-white hover:scale-105 active:scale-95 cursor-pointer"
            >
              <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
            </button>
          )}

          {/* Scrollable Container */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="no-scrollbar flex gap-8 sm:gap-9 lg:gap-10 overflow-x-auto py-2 scroll-smooth snap-x snap-mandatory"
          >
            {products.map((product) => {
              const isAdded = addedId === product.id;

              return (
                <div
                  key={product.id}
                  data-product-card
                  onClick={() => openProductModal(product.id)}
                  className="w-[82vw] sm:w-[340px] md:w-[380px] lg:w-[calc(33.333%-1.7rem)] shrink-0 snap-center sm:snap-start flex flex-col justify-between group/card cursor-pointer transition-all"
                >
                  {/* Product Image Frame: Seamless warm linen backdrop & gentle lift */}
                  <div className="relative aspect-[4/5] sm:aspect-[1/1] w-full overflow-hidden bg-[#f4f0e6]/70 rounded-xs transition-all duration-700 ease-out group-hover/card:bg-[#efebe0] group-hover/card:shadow-md">
                    <Image
                      src={product.image}
                      unoptimized
                      alt={product.name}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 85vw"
                      className="object-cover object-center transition-transform duration-700 ease-out group-hover/card:scale-[1.04]"
                    />

                    {/* Subtle Overlay Badge on Hover */}
                    <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/50 via-black/15 to-transparent opacity-0 translate-y-2 group-hover/card:opacity-100 group-hover/card:translate-y-0 transition-all duration-300 flex items-center justify-between text-white">
                      <span className="text-xs uppercase tracking-widest font-medium">Khám phá chi tiết</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/card:translate-x-1" />
                    </div>
                  </div>

                  {/* Product Information */}
                  <div className="pt-6 flex flex-1 flex-col justify-between">
                    <div>
                      {/* Category tag */}
                      <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#9d753d]">
                        {product.categoryName}
                      </span>

                      {/* Title */}
                      <h3 className="mt-2 text-lg sm:text-xl font-medium leading-snug tracking-[-0.02em] text-[#24231f] transition-colors duration-300 group-hover/card:text-[#9d753d] line-clamp-1">
                        {product.name}
                      </h3>

                      {/* Description */}
                      <p className="mt-2 text-sm text-[#5f5a51] line-clamp-2 leading-relaxed font-sans font-light">
                        {product.notes || product.desc}
                      </p>
                    </div>

                    {/* Price & Action Row */}
                    <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-[#24231f]/10 pt-4">
                      <span className="text-base sm:text-lg font-medium text-[#24231f] tracking-tight">
                        {product.price.toLocaleString("vi-VN")} đ
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => handleAddToCart(product, e)}
                          className="inline-flex items-center gap-1.5 rounded-full border border-[#24231f]/25 bg-transparent px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.12em] text-[#24231f] transition-all duration-300 hover:border-[#24231f] hover:bg-[#24231f] hover:text-white active:scale-95 cursor-pointer"
                        >
                          {isAdded ? (
                            <>
                              <Check className="h-3.5 w-3.5 text-emerald-600" />
                              <span className="text-emerald-700">Đã thêm</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="h-3.5 w-3.5" strokeWidth={1.25} />
                              <span>Thêm</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={(e) => handleBuyNow(product, e)}
                          className="inline-flex items-center gap-1.5 rounded-full bg-[#24231f] px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.12em] text-white transition-all duration-300 hover:bg-[#9d753d] active:scale-95 cursor-pointer shadow-xs"
                        >
                          <span>Mua ngay</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Minimalist Progress Track (Signature Aesop scroll indicator) */}
          <div className="mt-12 sm:mt-14 flex items-center justify-center">
            <div className="h-[2px] w-48 sm:w-64 bg-[#24231f]/12 relative overflow-hidden rounded-full">
              <div
                className="absolute top-0 bottom-0 bg-[#24231f] transition-all duration-300 rounded-full"
                style={{
                  left: `${scrollProgress * 65}%`,
                  width: "35%",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
