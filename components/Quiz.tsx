"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PRODUCTS, Product } from "@/lib/data";
import { useCart } from "@/lib/CartContext";
import { Sparkles, RotateCcw, Check, ShoppingBag, Eye } from "lucide-react";

export default function Quiz() {
  const [recommendedProduct, setRecommendedProduct] = useState<Product | null>(null);
  const [isAdded, setIsAdded] = useState(false);
  const { addToCart, openProductModal } = useCart();

  const handleSelectMood = (mood: string) => {
    let selected = PRODUCTS[0];
    if (mood === "stress") selected = PRODUCTS[0]; // Palo Santo
    if (mood === "focus") selected = PRODUCTS[3]; // Vòng Tây Tạng
    if (mood === "sleep") selected = PRODUCTS[2]; // Nến Thơm
    if (mood === "cleanse") selected = PRODUCTS[1]; // Xô Thơm
    setRecommendedProduct(selected);
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product.id);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const moodOptions = [
    {
      id: "stress",
      title: "Căng Thẳng & Quá Tải",
      desc: "Áp lực công việc đè nặng, đầu óc căng thẳng cần được xoa dịu và thanh tẩy năng lượng tiêu cực.",
      icon: "🌿",
      match: "Gỗ Palo Santo Nam Mỹ",
      accent: "from-amber-700/20 to-transparent"
    },
    {
      id: "focus",
      title: "Mất Tập Trung & Xao Nhãng",
      desc: "Khó định tâm khi đọc sách, làm việc sáng tạo hoặc thực hành thiền định mỗi ngày.",
      icon: "📿",
      match: "Vòng Tay Gỗ Bách Xanh",
      accent: "from-amber-600/20 to-transparent"
    },
    {
      id: "sleep",
      title: "Trôi Dạt & Khó Vào Giấc",
      desc: "Trằn trọc khi đêm xuống, cần một không gian ấm áp, thơm ngát mùi gỗ rừng để buông bỏ lo âu.",
      icon: "🕯️",
      match: "Nến Thơm Rừng Sương Mù",
      accent: "from-yellow-700/20 to-transparent"
    },
    {
      id: "cleanse",
      title: "Không Gian Mới / Tù Túng",
      desc: "Vừa chuyển tới phòng mới hoặc cảm thấy không khí ngột ngạt, muốn thanh tẩy toàn diện trường khí.",
      icon: "✨",
      match: "Bó Xô Thơm Trắng",
      accent: "from-orange-700/20 to-transparent"
    }
  ];

  return (
    <section id="quiz" className="py-28 sm:py-36 px-4 sm:px-8 lg:px-12 xl:px-16 max-w-[1400px] mx-auto relative overflow-hidden bg-linen-base">
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-forest-500/5 rounded-full blur-[160px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.8 }}
        className="bg-white/65 p-8 sm:p-14 lg:p-16 space-y-12 border border-forest-800/15 relative overflow-hidden w-full"
      >
        {/* Quiz Header */}
        <div className="text-center space-y-3 relative z-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 text-forest-700 text-xs tracking-[0.3em] uppercase font-mono font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-forest-600" />
            <span>Trải nghiệm cá nhân hóa</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl text-forest-950 font-light leading-tight descender-safe">
            Lắng nghe nhu cầu của bạn
          </h2>
          <p className="text-forest-800/80 font-light text-sm sm:text-base leading-relaxed">
            Hãy chạm vào trạng thái cảm xúc hiện tại của bạn, chúng tôi sẽ gợi ý vật phẩm tương ứng giúp cân bằng lại trường năng lượng.
          </p>
        </div>

        {/* Step 1: Mood Choice Options Spanning 4 Balanced Columns */}
        <AnimatePresence mode="wait">
          {!recommendedProduct ? (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-6 relative z-10 w-full"
            >
              <label className="block text-center text-xs uppercase tracking-[0.25em] text-forest-700 font-mono font-medium">
                Chọn trạng thái cảm xúc bạn muốn xoa dịu
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {moodOptions.map((opt, idx) => (
                  <motion.button
                    key={opt.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                    onClick={() => handleSelectMood(opt.id)}
                    className="p-6 text-center sm:text-left bg-white/75 hover:bg-forest-50/70 border border-forest-800/15 hover:border-forest-700 transition-all duration-300 group relative flex flex-col justify-between cursor-pointer"
                  >
                    <div className="space-y-3 flex flex-col items-center sm:items-start">
                      <div className="flex items-center justify-center sm:justify-between w-full">
                        <span className="text-3xl p-2 bg-forest-50 border border-forest-200 group-hover:border-forest-400 transition-colors">{opt.icon}</span>
                        <span className="hidden sm:inline-block text-[10px] uppercase tracking-widest text-forest-700 opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                          Chọn →
                        </span>
                      </div>
                      <h3 className="font-serif text-xl sm:text-2xl text-forest-950 group-hover:text-forest-700 transition-colors font-medium pt-1">
                        {opt.title}
                      </h3>
                      <p className="text-xs text-forest-800/80 font-light leading-relaxed">
                        {opt.desc}
                      </p>
                    </div>

                    <div className="pt-4 mt-6 border-t border-forest-800/10 text-[11px] text-forest-600 flex items-center justify-center sm:justify-between gap-1 w-full">
                      <span>Phù hợp với:</span>
                      <span className="text-forest-900 font-serif italic font-medium">{opt.match}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            /* Step 2: Rich Photographic Recommendation Card */
            <motion.div
              key="step-2"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.6 }}
              className="space-y-8 pt-4 border-t border-forest-800/15 text-center relative z-10"
            >
              <div className="inline-flex items-center gap-2 text-forest-700 text-xs tracking-[0.25em] uppercase font-semibold">
                <Sparkles className="w-4 h-4 text-forest-600 animate-pulse" />
                <span>Gợi Ý Dành Riêng Cho Bạn</span>
              </div>

              {/* Recommendation Detail Card with Image */}
              <div className="p-6 sm:p-10 bg-white/75 border border-forest-800/20 grid grid-cols-1 md:grid-cols-12 gap-8 items-center text-center sm:text-left max-w-4xl mx-auto relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-forest-500/10 rounded-full blur-3xl pointer-events-none" />

                {/* Product Photo */}
                <div className="md:col-span-5 relative aspect-square overflow-hidden border border-forest-800/15">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={recommendedProduct.image}
                    alt={recommendedProduct.name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 px-3 py-1 bg-forest-900 text-white text-[10px] font-semibold tracking-wider uppercase">
                    {recommendedProduct.badge || "Gợi ý tối ưu"}
                  </span>
                </div>

                {/* Product Info & Scent Pyramid */}
                <div className="md:col-span-7 space-y-4 flex flex-col items-center sm:items-start text-center sm:text-left">
                  <div>
                    <span className="text-[10px] text-forest-700 tracking-widest uppercase block mb-1 font-bold">
                      {recommendedProduct.origin}
                    </span>
                    <h3 className="font-serif text-2xl sm:text-3xl text-forest-950 font-light">
                      {recommendedProduct.name}
                    </h3>
                    <p className="text-xs text-forest-700 font-serif italic mt-1 font-medium">
                      ✦ {recommendedProduct.notes}
                    </p>
                  </div>

                  <p className="text-xs text-forest-800/80 font-light leading-relaxed">
                    {recommendedProduct.desc}
                  </p>

                  {/* Scent notes breakdown */}
                  <div className="p-4 bg-forest-50/80 rounded-xl border border-forest-800/10 space-y-1.5 text-xs text-forest-800 w-full text-left">
                    <div><strong className="text-forest-950">Tầng hương:</strong> {recommendedProduct.scentPyramid.top}</div>
                    <div><strong className="text-forest-950">Công dụng:</strong> {recommendedProduct.benefits[0]}</div>
                  </div>

                  {/* Price & Add to cart */}
                  <div className="pt-4 border-t border-forest-800/15 flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4 w-full">
                    <div>
                      <span className="font-serif text-2xl sm:text-3xl text-forest-900 font-bold">
                        {recommendedProduct.price.toLocaleString("vi-VN")} đ
                      </span>
                    </div>

                    <div className="flex gap-3 w-full sm:w-auto justify-center">
                      <button
                        onClick={() => openProductModal(recommendedProduct.id)}
                        className="px-4 py-2.5 border border-forest-800/20 hover:border-forest-700 text-forest-800 hover:text-forest-950 text-xs tracking-wider uppercase flex items-center justify-center gap-1.5 transition-colors cursor-pointer bg-[#f6f4ee] flex-1 sm:flex-none"
                      >
                        <Eye className="w-3.5 h-3.5 text-forest-600" />
                        <span>Chi Tiết</span>
                      </button>
                      <button
                        onClick={() => handleAddToCart(recommendedProduct)}
                        className="px-6 py-2.5 bg-forest-800 hover:bg-forest-700 text-white text-xs uppercase tracking-widest font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer flex-1 sm:flex-none"
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-4 h-4 text-sky-200" />
                            <span>Đã Thêm!</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-4 h-4 text-white" />
                            <span>Thêm Vào Giỏ</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reset Button */}
              <button
                onClick={() => setRecommendedProduct(null)}
                className="inline-flex items-center gap-2 text-xs text-forest-700 hover:text-forest-950 tracking-widest uppercase underline pt-2 transition-colors cursor-pointer font-medium"
              >
                <RotateCcw className="w-3.5 h-3.5 text-forest-600" />
                <span>Chọn Lại Cảm Xúc Khác</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
