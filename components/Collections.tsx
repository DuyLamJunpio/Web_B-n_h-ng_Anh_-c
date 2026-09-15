"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Check, Eye, ShoppingBag } from "lucide-react";
import { PRODUCTS, Product } from "@/lib/data";
import { useCart } from "@/lib/CartContext";

const filters = [
  { id: "all", label: "Tất cả" },
  { id: "purify", label: "Thanh tẩy" },
  { id: "warmth", label: "Hơi ấm" },
  { id: "energy", label: "Năng lượng" },
];

export default function Collections() {
  const [filter, setFilter] = useState("all");
  const [addedId, setAddedId] = useState<string | null>(null);
  const { addToCart, openProductModal } = useCart();

  const products = filter === "all" ? PRODUCTS : PRODUCTS.filter((product) => product.category === filter);

  const addProduct = (product: Product) => {
    addToCart(product.id);
    setAddedId(product.id);
    window.setTimeout(() => setAddedId(null), 1600);
  };

  return (
    <section id="collections" className="bg-[#f3f1eb] px-5 py-20 text-[#282723] sm:px-8 sm:py-28 lg:px-12">
      <div className="mx-auto max-w-[1400px]">
        <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.6 }} className="max-w-2xl">
          <h2 className="text-4xl font-light leading-[1.05] tracking-[-0.045em] sm:text-5xl lg:text-6xl">Những vật phẩm cho đời sống thường nhật</h2>
          <p className="mt-5 max-w-xl text-sm leading-6 text-[#625f57] sm:text-base">Gỗ, khói, ánh sáng và những nốt hương được chọn để ở lại thật lâu trong không gian của bạn.</p>
        </motion.div>

        <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 border-y border-[#282723]/15 py-4 text-xs">
          <span className="mr-3 text-[#625f57]">Xem theo</span>
          {filters.map((item) => (
            <button key={item.id} type="button" onClick={() => setFilter(item.id)} className={`border-b pb-1 transition-colors ${filter === item.id ? "border-[#282723] text-[#282723]" : "border-transparent text-[#77736b] hover:border-[#77736b] hover:text-[#282723]"}`}>
              {item.label}
            </button>
          ))}
        </div>

        <motion.div layout className="mt-10 grid grid-cols-1 gap-x-5 gap-y-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-y-16">
          <AnimatePresence mode="popLayout">
            {products.map((product, index) => (
              <motion.article key={product.id} layout initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} transition={{ duration: 0.45, delay: index * 0.04 }} className={`${index === 0 ? "lg:col-span-7" : index === 1 ? "lg:col-span-5" : "lg:col-span-4"} group`}>
                <button type="button" onClick={() => openProductModal(product.id)} className="relative block w-full overflow-hidden bg-[#e4e0d6] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8d693a]">
                  {/* Product photography comes from the catalog data and remains an actual image, not a CSS mock. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={product.image} alt={product.name} className={`w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035] ${index === 0 ? "aspect-[1.22]" : "aspect-[1.08]"}`} />
                  <span className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center bg-[#f3f1eb]/90 text-[#282723] opacity-0 transition-opacity duration-300 group-hover:opacity-100"><Eye className="h-4 w-4" strokeWidth={1.25} /></span>
                </button>

                <div className="flex items-start justify-between gap-4 border-b border-[#282723]/15 py-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.16em] text-[#77736b]">{product.categoryName}</p>
                    <h3 className="mt-2 max-w-[24rem] text-base font-medium leading-5">{product.name}</h3>
                    <p className="mt-2 text-xs leading-5 text-[#625f57]">{product.notes}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm">{product.price.toLocaleString("vi-VN")}đ</p>
                    <button type="button" onClick={() => addProduct(product)} className="mt-4 inline-flex items-center gap-1 text-[11px] font-medium text-[#625f57] transition-colors hover:text-[#8d693a]">
                      {addedId === product.id ? <><Check className="h-3.5 w-3.5" />Đã thêm</> : <><ShoppingBag className="h-3.5 w-3.5" />Thêm vào giỏ</>}
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        <a href="#about" className="mt-14 inline-flex items-center gap-2 border-b border-[#282723] pb-1 text-sm transition-colors hover:text-[#8d693a]">Tìm hiểu về RUNGU <ArrowUpRight className="h-4 w-4" strokeWidth={1.25} /></a>
      </div>
    </section>
  );
}
