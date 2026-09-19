"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/lib/CartContext";
import { Star, Check, ShoppingBag, X, Shield, Sparkles, Truck, ArrowRight } from "lucide-react";

export default function ProductModal() {
  const { selectedProduct, closeProductModal, addToCart } = useCart();
  const [activeImage, setActiveImage] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdded, setIsAdded] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState<string>("");

  useEffect(() => {
    if (selectedProduct) {
      // Reset the local gallery and quantity whenever a different product opens.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveImage(selectedProduct.image);
      setQuantity(1);
      setIsAdded(false);
      setSelectedVariantId(selectedProduct.variants?.find((variant) => variant.available)?.id ?? "");
    }
  }, [selectedProduct]);

  if (!selectedProduct) return null;

  const availableVariants = (selectedProduct.variants ?? []).filter((variant) => variant.available);
  const selectedVariant = availableVariants.find((variant) => variant.id === selectedVariantId);
  const currentPrice = selectedVariant?.price ?? selectedProduct.price;
  const canBuy = selectedProduct.inStock !== false
    && (availableVariants.length > 0 || !(selectedProduct.variants?.length));

  const handleAdd = () => {
    const added = addToCart(selectedProduct.id, selectedVariant?.id, quantity);
    if (!added) return;
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      closeProductModal();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 transition-opacity duration-300 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-forest-950/60 backdrop-blur-sm transition-opacity"
        onClick={closeProductModal}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white border border-forest-800/20 max-w-3xl w-full rounded-2xl shadow-2xl z-10 max-h-[90vh] overflow-y-auto my-auto grid grid-cols-1 md:grid-cols-12 gap-8 p-6 sm:p-8">
        {/* Close Button */}
        <button
          onClick={closeProductModal}
          className="absolute top-4 right-4 text-forest-700 hover:text-forest-950 text-xl z-20 w-8 h-8 rounded-full bg-forest-50 flex items-center justify-center border border-forest-800/15 hover:bg-forest-100 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left: Image Gallery */}
        <div className="md:col-span-5 space-y-4">
          <div className="relative aspect-square rounded-xl overflow-hidden border border-forest-800/10 bg-forest-50/50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeImage || selectedProduct.image}
              alt={selectedProduct.name}
              className="w-full h-full object-cover"
            />
            {selectedProduct.badge && (
              <span className="absolute top-3 left-3 px-2.5 py-1 bg-forest-800 text-white text-[10px] font-semibold tracking-wider uppercase rounded-full shadow-sm">
                {selectedProduct.badge}
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {selectedProduct.gallery && selectedProduct.gallery.length > 1 && (
            <div className="flex gap-3">
              {selectedProduct.gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border transition-all cursor-pointer ${
                    activeImage === img ? "border-forest-800 ring-2 ring-forest-800/40" : "border-forest-800/15 opacity-70 hover:opacity-100"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt="thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details */}
        <div className="md:col-span-7 space-y-5 flex flex-col justify-between text-left">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-forest-700 tracking-[0.2em] uppercase font-semibold">
                {selectedProduct.categoryName} • {selectedProduct.origin}
              </span>
              <div className="flex items-center gap-1 text-forest-800">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span className="font-semibold text-sm">{selectedProduct.rating}</span>
                <span className="text-forest-600 font-serif text-xs sm:text-sm">({selectedProduct.reviewsCount} lượt đã chọn)</span>
              </div>
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl text-forest-950 font-semibold tracking-[-0.02em]">
              {selectedProduct.name}
            </h3>

            <p className="text-sm text-forest-700 italic font-serif">
              ✦ {selectedProduct.notes}
            </p>

            <p className="text-forest-800 text-sm sm:text-base leading-relaxed">
              {selectedProduct.detail || selectedProduct.desc}
            </p>

            {/* Scent Pyramid Box */}
            {selectedProduct.scentPyramid && (
              <div className="p-4 bg-forest-50/70 rounded-xl border border-forest-800/10 space-y-2 text-sm text-forest-800">
                <div className="text-xs font-semibold text-forest-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-forest-700" />
                  <span>Tầng Hương Tự Nhiên</span>
                </div>
                <div><strong className="text-forest-950">Hương đầu:</strong> {selectedProduct.scentPyramid.top}</div>
                <div><strong className="text-forest-950">Hương giữa:</strong> {selectedProduct.scentPyramid.middle}</div>
                <div><strong className="text-forest-950">Hương cuối:</strong> {selectedProduct.scentPyramid.base}</div>
              </div>
            )}

            {/* Benefits list */}
            {selectedProduct.benefits && (
              <div className="space-y-2 pt-1 text-sm text-forest-800">
                <span className="text-forest-900 font-semibold block">Công dụng chính:</span>
                {selectedProduct.benefits.map((b, i) => (
                  <div key={i} className="flex items-center gap-2 text-forest-800">
                    <Check className="w-4 h-4 text-forest-700 flex-shrink-0" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Price, Quantity & Add to Cart Action */}
          <div className="pt-4 border-t border-forest-800/10 space-y-4">
            {availableVariants.length > 0 && (
              <div className="space-y-2">
                <span className="block text-xs font-semibold uppercase tracking-wider text-forest-900">
                  Chọn quy cách / mùi hương
                </span>
                <div className="flex flex-wrap gap-2">
                  {availableVariants.map((variant) => (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() => {
                        setSelectedVariantId(variant.id);
                        setQuantity(1);
                      }}
                      className={`rounded-sm border px-3 py-2 text-xs font-medium transition-colors ${
                        selectedVariantId === variant.id
                          ? "border-forest-800 bg-forest-800 text-white"
                          : "border-forest-800/20 bg-white text-forest-900 hover:border-forest-800"
                      }`}
                    >
                      {variant.label} · còn {variant.stock}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-baseline justify-between">
              <span className="font-serif text-3xl text-forest-800 font-bold">
                {(currentPrice * quantity).toLocaleString("vi-VN")} đ
              </span>
              {selectedProduct.originalPrice && (
                <span className="text-sm text-forest-400 line-through font-serif">
                  {(selectedProduct.originalPrice * quantity).toLocaleString("vi-VN")} đ
                </span>
              )}
            </div>

            <div className="flex gap-4">
              {/* Quantity selector */}
              <div className="flex items-center border border-forest-800/20 rounded-lg bg-forest-50/60">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3.5 py-2 text-forest-700 hover:text-forest-950 text-base transition-colors cursor-pointer"
                >
                  -
                </button>
                <span className="px-3 text-sm font-semibold text-forest-950">{quantity}</span>
                <button
                  onClick={() => setQuantity(selectedVariant && selectedProduct.manageStock
                    ? Math.min(selectedVariant.stock, quantity + 1)
                    : quantity + 1)}
                  className="px-3.5 py-2 text-forest-700 hover:text-forest-950 text-base transition-colors cursor-pointer"
                >
                  +
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAdd}
                disabled={!canBuy}
                className="flex-1 py-3.5 bg-forest-800 hover:bg-forest-700 disabled:cursor-not-allowed disabled:opacity-50 text-white text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-forest-900/15 cursor-pointer"
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Đã Thêm Vào Giỏ Hàng!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>{canBuy ? "Thêm Vào Giỏ Hàng" : "Tạm Hết Hàng"}</span>
                  </>
                )}
              </button>
            </div>

            <div className="pt-2 text-center">
              <Link
                href={`/san-pham/${selectedProduct.id}`}
                onClick={closeProductModal}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-forest-800 hover:text-[#9d753d] transition-colors underline underline-offset-4"
              >
                <span>Xem trang chi tiết sản phẩm đầy đủ</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="flex items-center justify-center gap-4 text-[10px] text-forest-600 uppercase tracking-widest pt-1">
              <span className="flex items-center gap-1"><Truck className="w-3 h-3 text-forest-700" /> Giao hàng toàn quốc</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Shield className="w-3 h-3 text-forest-700" /> Đổi trả trong 7 ngày</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
