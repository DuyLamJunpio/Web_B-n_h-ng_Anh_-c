"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Check, Eye, ShoppingBag, Star } from "lucide-react";
import type { Product } from "@/lib/data";
import { useCart } from "@/lib/CartContext";

export default function Collections() {
  const [addedId, setAddedId] = useState<string | null>(null);
  const { addToCart, openProductModal, products, selectedCategory, setSelectedCategory, storefrontContent } = useCart();
  const managedCollection = storefrontContent.collections[0];

  const getFilterCount = (filterId: string) => {
    if (filterId === "all") return products.length;
    if (filterId === "new") {
      return products.filter((p) =>
        Boolean(p.badge?.includes("Mới") || p.badge?.includes("Bán chạy") || p.badge?.includes("Được yêu thích") || p.rating >= 4.9)
      ).length;
    }
    if (filterId === "sale") {
      return products.filter((p) => Boolean(p.originalPrice && p.originalPrice > p.price)).length;
    }
    return products.filter((p) => p.category === filterId).length;
  };

  const filters = [
    { id: "all", label: "Tất cả" },
    { id: "new", label: "Mới & Nổi bật" },
    { id: "sale", label: "Ưu đãi" },
    ...Array.from(new Map(products.map((product) => [product.category, product.categoryName])).entries())
      .map(([id, label]) => ({ id, label })),
  ];

  const visibleProducts = products.filter((product) => {
    if (
      selectedCategory === "all"
      && managedCollection?.product_slugs.length
      && !managedCollection.product_slugs.includes(product.slug ?? "")
    ) return false;
    if (selectedCategory === "all") return true;
    if (selectedCategory === "new") {
      return Boolean(
        product.badge?.includes("Mới") ||
        product.badge?.includes("Bán chạy") ||
        product.badge?.includes("Được yêu thích") ||
        product.rating >= 4.9
      );
    }
    if (selectedCategory === "sale") {
      return Boolean(product.originalPrice && product.originalPrice > product.price);
    }
    return product.category === selectedCategory;
  });

  const addProduct = (product: Product) => {
    if (!addToCart(product.id)) return;
    setAddedId(product.id);
    window.setTimeout(() => setAddedId(null), 1600);
  };

  return (
    <section id="collections" className="scroll-mt-20 bg-[#f3f1eb] px-5 py-20 text-[#282723] sm:px-8 sm:py-28 lg:px-12">
      <div className="mx-auto max-w-[1500px]">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-10 border-b border-[#282723]/15">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-[#9d753d] mb-3.5">
              Tuyển chọn tự nhiên · Thủ công tinh xảo
            </p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-normal leading-[1.12] tracking-[-0.03em] text-[#24231f]">
              {managedCollection?.title || "Những vật phẩm cho đời sống thường nhật"}
            </h2>
            <p className="mt-4 max-w-xl text-base sm:text-lg leading-relaxed text-[#55524a]">
              {managedCollection?.subtitle || "Gỗ, khói, ánh sáng và những nốt hương được chọn để ở lại thật lâu trong không gian của bạn."}
            </p>
          </motion.div>

          <div className="hidden md:flex items-center gap-2 text-sm font-medium tracking-wider text-[#8c887f]">
            <span>HIỂN THỊ</span>
            <span className="font-semibold text-[#282723]">{visibleProducts.length}</span>
            <span>/ {products.length} VẬT PHẨM</span>
          </div>
        </div>

        {/* Filter Pill Tabs */}
        <div className="mt-8 flex flex-wrap items-center gap-2.5 pb-2">
          {filters.map((item) => {
            const count = getFilterCount(item.id);
            const isSelected = selectedCategory === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedCategory(item.id)}
                className={`group inline-flex items-center gap-2 rounded-full px-4.5 py-2.5 text-sm font-medium transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? "bg-[#282723] text-white shadow-sm"
                    : "bg-white/60 text-[#625f57] hover:bg-white hover:text-[#282723] border border-[#282723]/10"
                }`}
              >
                <span>{item.label}</span>
                <span
                  className={`text-xs rounded-full px-2 py-0.5 transition-colors ${
                    isSelected
                      ? "bg-white/20 text-white"
                      : "bg-[#282723]/5 text-[#8c887f] group-hover:bg-[#282723]/10 group-hover:text-[#282723]"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Balanced Curated Product Grid */}
        <motion.div layout className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:gap-10">
          <AnimatePresence mode="popLayout">
            {visibleProducts.map((product, index) => {
              const discountPercent =
                product.originalPrice && product.originalPrice > product.price
                  ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                  : null;

              return (
                <motion.article
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={{ duration: 0.45, delay: index * 0.05 }}
                  className="group flex flex-col justify-between rounded-2xl bg-[#eae6dc]/40 p-4 transition-all duration-500 hover:bg-white hover:shadow-[0_20px_45px_rgba(0,0,0,0.06)] border border-[#282723]/8 hover:border-[#282723]/15"
                >
                  <div>
                    {/* Image Showcase Frame */}
                    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-[#ded8cb] text-left">
                      <Link href={`/san-pham/${product.id}`} className="block h-full w-full focus-visible:outline-none">
                        {/* Primary Image */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={product.image}
                          alt={product.name}
                          className={`h-full w-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-[1.04] ${
                            product.gallery?.[1] ? "group-hover:opacity-0" : ""
                          }`}
                        />

                        {/* Secondary Gallery Image on Hover */}
                        {product.gallery?.[1] && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={product.gallery[1]}
                            alt={`${product.name} - chi tiết`}
                            className="absolute inset-0 h-full w-full object-cover object-center opacity-0 transition-all duration-700 ease-out group-hover:scale-[1.04] group-hover:opacity-100"
                          />
                        )}
                      </Link>

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
                        <div className="flex items-center gap-1.5">
                          {product.badge && (
                            <span className="rounded-full bg-[#282723]/80 backdrop-blur-md px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white border border-white/20">
                              {product.badge}
                            </span>
                          )}
                          {discountPercent && (
                            <span className="rounded-full bg-[#9d753d] px-2.5 py-1 text-[10px] font-bold text-white shadow-sm">
                              -{discountPercent}%
                            </span>
                          )}
                        </div>

                        {/* Quick View Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            openProductModal(product.id);
                          }}
                          title="Xem nhanh vật phẩm"
                          aria-label={`Xem nhanh ${product.name}`}
                          className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full bg-white/85 text-[#282723] backdrop-blur-md opacity-0 transition-all duration-300 group-hover:opacity-100 hover:bg-[#282723] hover:text-white shadow-sm"
                        >
                          <Eye className="h-4 w-4" strokeWidth={1.5} />
                        </button>
                      </div>
                    </div>

                    {/* Product Typography Information */}
                    <div className="pt-5">
                      <div className="flex items-center justify-between text-xs uppercase tracking-[0.16em] text-[#8c887f] font-medium">
                        <span>{product.categoryName}</span>
                        <span>{product.origin.split("(")[0].trim()}</span>
                      </div>

                      <h3 className="mt-2 text-xl sm:text-2xl font-semibold leading-snug tracking-[-0.02em] text-[#24231f]">
                        <Link
                          href={`/san-pham/${product.id}`}
                          className="transition-colors hover:text-[#9d753d] line-clamp-1"
                        >
                          {product.name}
                        </Link>
                      </h3>

                      <p className="mt-2 text-sm leading-relaxed text-[#55524a] line-clamp-2">
                        {product.notes}
                      </p>

                      {/* Rating & Review */}
                      <div className="mt-3.5 flex items-center gap-2 text-sm text-[#77736b]">
                        <div className="flex items-center text-[#9d753d]">
                          <Star className="h-4 w-4 fill-[#9d753d]" />
                        </div>
                        <span className="font-semibold text-[#24231f]">{product.rating}</span>
                        <span className="text-[#99948a]">({product.reviewsCount} đánh giá)</span>
                      </div>
                    </div>
                  </div>

                  {/* Price & Add to Cart Footer */}
                  <div className="mt-6 flex items-center justify-between pt-4.5 border-t border-[#282723]/10">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg sm:text-xl font-bold text-[#24231f]">
                          {product.price.toLocaleString("vi-VN")}đ
                        </span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-xs text-[#9c978f] line-through">
                            {product.originalPrice.toLocaleString("vi-VN")}đ
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#8c887f] mt-0.5">Miễn phí vận chuyển</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => addProduct(product)}
                      className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 cursor-pointer ${
                        addedId === product.id
                          ? "bg-emerald-700 text-white shadow-sm"
                          : "bg-[#282723] text-white hover:bg-[#9d753d] shadow-sm"
                      }`}
                    >
                      {addedId === product.id ? (
                        <>
                          <Check className="h-4 w-4" />
                          <span>Đã thêm</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="h-4 w-4" />
                          <span>Thêm vào giỏ</span>
                        </>
                      )}
                    </button>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Section Bottom Links */}
        <div className="mt-16 flex flex-wrap items-center justify-between gap-6 border-t border-[#282723]/15 pt-8">
          <a
            href="#about"
            className="group inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-[#9d753d]"
          >
            <span className="border-b border-current pb-0.5">Tìm hiểu triết lý chọn nguyên liệu của RUNGU</span>
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.5} />
          </a>

          <Link
            href="/san-pham"
            className="inline-flex items-center gap-2.5 rounded-full border border-[#282723] bg-[#282723] px-6 py-3 text-xs font-medium uppercase tracking-[0.16em] text-white transition-all hover:bg-black hover:shadow-md"
          >
            <span>Khám phá toàn bộ danh mục vật phẩm</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
