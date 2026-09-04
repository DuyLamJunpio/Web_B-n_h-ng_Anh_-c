"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PRODUCTS, Product } from "@/lib/data";
import { useCart } from "@/lib/CartContext";
import { Star, Eye, ShoppingBag, Sparkles, Flame, Check } from "lucide-react";

export default function Collections() {
  const [filter, setFilter] = useState<string>("all");
  const [addedId, setAddedId] = useState<string | null>(null);
  const { addToCart, openProductModal } = useCart();

  const filteredProducts =
    filter === "all"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === filter);

  const handleAddWithFeedback = (product: Product) => {
    addToCart(product.id);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1800);
  };

  const categories = [
    { id: "all", label: "Tất Cả", count: PRODUCTS.length },
    { id: "purify", label: "Thanh Tẩy & Tẩy Uế", count: PRODUCTS.filter(p => p.category === 'purify').length },
    { id: "warmth", label: "Hơi Ấm & Ánh Sáng", count: PRODUCTS.filter(p => p.category === 'warmth').length },
    { id: "energy", label: "Năng Lượng & Thiền", count: PRODUCTS.filter(p => p.category === 'energy').length },
  ];

  return (
    <section
      id="collections"
      className="py-28 sm:py-36 bg-linen-alt border-y border-forest-800/10 relative overflow-hidden"
    >
      {/* Background Subtle Ambient Glow */}
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-forest-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-forest-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
        {/* Section Header & Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8"
        >
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-forest-700 text-xs tracking-[0.3em] uppercase font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-forest-600" />
              <span>Tuyển Tập Thủ Công Tự Nhiên</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-forest-950 font-light leading-tight descender-safe">
              Những Vật Phẩm Chữa Lành
            </h2>
            <p className="text-forest-800/80 font-light text-sm sm:text-base leading-relaxed">
              Mỗi vật phẩm là một tạo tác của thiên nhiên hoang sơ, mang nguồn năng lượng thanh khiết giúp phục hồi sự cân bằng trong tâm trí và không gian sống.
            </p>
          </div>

          {/* Category Filter Tabs with active indicators */}
          <div className="flex flex-wrap gap-2 text-xs">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`px-4 sm:px-5 py-2.5 rounded-full transition-all duration-300 flex items-center gap-2 cursor-pointer font-medium ${
                  filter === cat.id
                    ? "border border-forest-800 text-white bg-forest-800 shadow-md shadow-forest-900/15"
                    : "border border-forest-800/15 text-forest-800 hover:border-forest-700 hover:text-forest-950 bg-white/90 shadow-sm"
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[10px] font-serif ${filter === cat.id ? "text-white/80" : "text-forest-600"}`}>({cat.count})</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Dynamic Product Grid with Staggered Animations */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {filteredProducts.map((p, index) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6, delay: index * 0.08, ease: "easeOut" }}
                className="bg-white/95 rounded-2xl overflow-hidden flex flex-col justify-between group relative border border-forest-800/15 hover:border-forest-700 transition-all duration-500 shadow-sm hover:shadow-xl"
              >
                {/* Top Photo Frame with Zoom & Hover Actions */}
                <div className="relative aspect-[4/3] sm:aspect-[4/3.2] overflow-hidden bg-forest-50">
                  {/* Product Image */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover object-center group-hover:scale-108 group-hover:filter group-hover:brightness-105 transition-all duration-700 ease-out"
                  />

                  {/* Subtle Image Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-950/60 via-transparent to-transparent pointer-events-none" />

                  {/* Floating Badges */}
                  <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5 z-10">
                    {p.badge && (
                      <span className="px-3 py-1 rounded-full bg-forest-900 text-white text-[10px] font-semibold tracking-wider uppercase shadow-md">
                        {p.badge}
                      </span>
                    )}
                    <span className="px-2.5 py-1 rounded-full bg-white/90 text-forest-800 text-[10px] tracking-wider uppercase border border-forest-800/15 backdrop-blur-md shadow-sm">
                      {p.origin}
                    </span>
                  </div>

                  {/* Quick Action Overlay on Hover */}
                  <div className="absolute inset-0 bg-forest-950/35 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-[2px] p-4">
                    <button
                      onClick={() => openProductModal(p.id)}
                      className="px-4 py-2.5 rounded-full bg-white/95 hover:bg-forest-800 text-forest-800 hover:text-white text-xs font-medium tracking-wider uppercase border border-forest-800/20 flex items-center gap-1.5 transition-all transform translate-y-2 group-hover:translate-y-0 duration-300 shadow-md cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Xem Nhanh</span>
                    </button>
                    <button
                      onClick={() => handleAddWithFeedback(p)}
                      className="px-4 py-2.5 rounded-full bg-forest-800 hover:bg-forest-700 text-white text-xs font-semibold tracking-wider uppercase flex items-center gap-1.5 transition-all transform translate-y-2 group-hover:translate-y-0 duration-300 shadow-xl cursor-pointer"
                    >
                      {addedId === p.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-200" />
                          <span>Đã Thêm</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>+ Giỏ Hàng</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Bottom Card Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    {/* Rating and Scent Category */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[11px] text-forest-700 tracking-[0.2em] uppercase font-semibold">
                        {p.categoryName}
                      </span>
                      <div className="flex items-center gap-1.5 text-forest-700 text-[11px]">
                        <Star className="w-3 h-3 fill-amberWood text-amberWood" />
                        <span className="text-forest-900 font-bold">{p.rating}</span>
                        <span className="text-forest-500 font-serif">({p.reviewsCount})</span>
                      </div>
                    </div>

                    {/* Product Title */}
                    <h3
                      onClick={() => openProductModal(p.id)}
                      className="font-serif text-xl sm:text-2xl text-forest-950 group-hover:text-forest-700 transition-colors cursor-pointer line-clamp-1 font-normal"
                    >
                      {p.name}
                    </h3>

                    {/* Scent Note tag */}
                    <p className="text-xs text-forest-700 font-medium line-clamp-1 italic font-serif">
                      ✦ {p.notes}
                    </p>

                    {/* Short Description */}
                    <p className="text-forest-800/75 text-xs font-light line-clamp-2 leading-relaxed">
                      {p.desc}
                    </p>
                  </div>

                  {/* Price & Action Bar */}
                  <div className="pt-4 border-t border-forest-800/10 flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="font-serif text-xl sm:text-2xl text-forest-900 font-semibold">
                        {p.price.toLocaleString("vi-VN")} đ
                      </span>
                      {p.originalPrice && (
                        <span className="text-xs text-forest-500 line-through font-serif">
                          {p.originalPrice.toLocaleString("vi-VN")} đ
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleAddWithFeedback(p)}
                      className="px-4 py-2 text-[11px] uppercase tracking-widest bg-white hover:bg-forest-800 text-forest-800 hover:text-white border border-forest-800/20 hover:border-forest-800 rounded-full font-medium transition-all duration-300 flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      {addedId === p.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-700 font-semibold">Đã Thêm</span>
                        </>
                      ) : (
                        <span>+ Chọn</span>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Bottom Guarantee Banner Spanning Full Width */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-16 p-6 sm:p-8 rounded-2xl bg-white/95 backdrop-blur-md border border-forest-800/15 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left shadow-lg"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-forest-100 border border-forest-300 flex items-center justify-center text-forest-800 flex-shrink-0 shadow-sm">
              <Flame className="w-6 h-6 text-forest-700 animate-pulse" />
            </div>
            <div>
              <h4 className="font-serif text-lg text-forest-950 font-normal">Đóng gói chuẩn nghi thức an tịnh</h4>
              <p className="text-forest-800/80 text-xs font-light mt-0.5">Mỗi kiện hàng đều được xông trầm thơm dịu và bọc gói bằng giấy mộc tái chế thân thiện môi trường.</p>
            </div>
          </div>
          <a
            href="#quiz"
            className="px-7 py-3 border border-forest-700 hover:border-forest-900 text-forest-800 hover:bg-forest-800 hover:text-white text-xs uppercase tracking-widest font-semibold rounded-full whitespace-nowrap transition-all shadow-sm"
          >
            Tư Vấn Mùi Hương Cá Nhân
          </a>
        </motion.div>
      </div>
    </section>
  );
}
