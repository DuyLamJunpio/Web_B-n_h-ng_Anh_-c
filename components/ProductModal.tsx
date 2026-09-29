"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/CartContext";
import { Star, Check, ShoppingBag, X, Shield, Sparkles, Truck, ArrowRight, Minus, Plus } from "lucide-react";

export default function ProductModal() {
  const router = useRouter();
  const { selectedProduct, closeProductModal, addToCart, setCartOpen } = useCart();
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
      setSelectedVariantId(
        selectedProduct.variants?.find((variant) => variant.available)?.id
        ?? selectedProduct.variants?.[0]?.id
        ?? ""
      );
    }
  }, [selectedProduct]);

  if (!selectedProduct) return null;

  const availableVariants = (selectedProduct.variants ?? []).filter((variant) => variant.available);
  const selectedVariant = (selectedProduct.variants ?? []).find((variant) => variant.id === selectedVariantId) ?? availableVariants[0];
  const currentPrice = selectedVariant?.price ?? selectedProduct.price;
  const canBuy = selectedProduct.inStock !== false
    && (availableVariants.length > 0 || !(selectedProduct.variants?.length));
  const isDefaultVariantOnly =
    (selectedProduct.variants?.length === 1) &&
    ["mặc định", "mặc định / mặc định", "default"].includes(
      (selectedProduct.variants[0].label || "").trim().toLowerCase()
    );
  const hasVisibleVariants = selectedProduct.hasVariants ?? (
    (selectedProduct.variants?.length ?? 0) > 1 ||
    ((selectedProduct.variants?.length ?? 0) === 1 && !isDefaultVariantOnly)
  );
  const hasDiscount = Boolean(selectedProduct.originalPrice && selectedProduct.originalPrice > currentPrice);
  const discountPercent = selectedProduct.discountPercent ?? (
    hasDiscount && selectedProduct.originalPrice
      ? Math.round(((selectedProduct.originalPrice - currentPrice) / selectedProduct.originalPrice) * 100)
      : 0
  );
  const totalPrice = currentPrice * quantity;
  const totalOriginalPrice = (selectedProduct.originalPrice ?? 0) * quantity;
  const media = [...selectedProduct.gallery, ...(selectedProduct.videos ?? [])];
  const activeIsVideo = selectedProduct.videos?.includes(activeImage) ?? false;

  const handleAdd = () => {
    const added = addToCart(selectedProduct.id, selectedVariant?.id, quantity);
    if (!added) return;
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      closeProductModal();
    }, 1200);
  };

  const handleBuyNow = () => {
    const added = addToCart(selectedProduct.id, selectedVariant?.id, quantity);
    if (!added) return;
    closeProductModal();
    setCartOpen(false);
    router.push("/thanh-toan");
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
            {activeIsVideo ? (
              <video key={activeImage} src={activeImage} controls playsInline className="w-full h-full object-contain" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={activeImage || selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
              />
            )}
            {selectedProduct.badge && (
              <span className="absolute top-3 left-3 px-2.5 py-1 bg-forest-800 text-white text-[10px] font-semibold tracking-wider uppercase rounded-full shadow-sm">
                {selectedProduct.badge}
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {media.length > 1 && (
            <div className="flex gap-3 justify-center md:justify-start">
              {media.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border transition-all cursor-pointer ${
                    activeImage === img ? "border-forest-800 ring-2 ring-forest-800/40" : "border-forest-800/15 opacity-70 hover:opacity-100"
                  }`}
                >
                  {selectedProduct.videos?.includes(img) ? (
                    <span className="flex h-full w-full items-center justify-center bg-forest-900 text-xs text-white">Video</span>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={img} alt={`Góc nhìn ${idx + 1}`} className="w-full h-full object-cover" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details */}
        <div className="md:col-span-7 space-y-5 flex flex-col justify-between text-left">
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-1 text-xs sm:text-sm text-center sm:text-left">
              <span className="text-forest-700 tracking-[0.2em] uppercase font-semibold">
                {selectedProduct.categoryName}{selectedProduct.origin ? ` • ${selectedProduct.origin}` : ""}
              </span>
              {selectedProduct.rating > 0 ? (
                <div className="flex items-center gap-1 text-forest-800">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span className="font-semibold text-sm">{selectedProduct.rating}</span>
                  <span className="text-forest-600 font-serif text-xs sm:text-sm">({selectedProduct.reviewsCount} đánh giá)</span>
                </div>
              ) : (selectedProduct.soldCount ?? 0) > 0 ? (
                <span className="text-forest-600 text-xs sm:text-sm">Đã bán {selectedProduct.soldCount}</span>
              ) : null}
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl text-forest-950 font-semibold tracking-[-0.02em] text-center sm:text-left">
              {selectedProduct.name}
            </h3>

            {selectedProduct.notes && (
              <p className="text-sm text-forest-700 italic font-serif text-center sm:text-left">
                ✦ {selectedProduct.notes}
              </p>
            )}

            <p className="text-forest-800 text-sm sm:text-base leading-relaxed text-center sm:text-left">
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
            {selectedProduct.benefits && selectedProduct.benefits.length > 0 && (
              <div className="space-y-2 pt-1 text-sm text-forest-800">
                <span className="text-forest-900 font-semibold block text-center sm:text-left">Công dụng chính:</span>
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
            {hasVisibleVariants && (
              <div className="space-y-2 text-center sm:text-left">
                <span className="block text-xs font-semibold uppercase tracking-wider text-forest-900">
                  Chọn phân loại
                </span>
                <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                  {selectedProduct.variants?.map((variant) => (
                    <button
                      key={variant.id}
                      type="button"
                      disabled={!variant.available}
                      onClick={() => {
                        setSelectedVariantId(variant.id);
                        setQuantity(1);
                      }}
                      className={`rounded-sm border px-3 py-2 text-xs font-medium transition-colors ${
                        selectedVariantId === variant.id
                          ? "border-forest-800 bg-forest-800 text-white"
                          : "border-forest-800/20 bg-white text-forest-900 hover:border-forest-800 disabled:cursor-not-allowed disabled:opacity-50"
                      }`}
                    >
                      {variant.label}{selectedProduct.manageStock ? variant.available ? ` · còn ${variant.stock}` : " · hết hàng" : ""}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Price Box with Discount */}
            {hasDiscount ? (
              <div className="space-y-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <span className="text-xs text-forest-500 font-medium">Giá gốc:</span>
                  <span className="text-sm sm:text-base text-forest-400 line-through font-serif">
                    {totalOriginalPrice.toLocaleString("vi-VN")} đ
                  </span>
                  {discountPercent > 0 && (
                    <span className="rounded-full bg-red-50 border border-red-200/80 px-2 py-0.5 text-[11px] font-bold text-red-600">
                      -{discountPercent}%
                    </span>
                  )}
                </div>

                <div className="flex items-baseline justify-center sm:justify-start gap-2.5">
                  <span className="font-serif text-3xl sm:text-4xl text-red-600 font-bold tracking-tight">
                    {totalPrice.toLocaleString("vi-VN")} đ
                  </span>
                  <span className="text-[11px] font-semibold text-red-600 bg-red-50 border border-red-200/60 uppercase tracking-wider px-2 py-0.5 rounded">
                    Giá ưu đãi
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-baseline justify-center sm:justify-start gap-3">
                <span className="font-serif text-3xl sm:text-4xl text-forest-900 font-bold tracking-tight">
                  {totalPrice.toLocaleString("vi-VN")} đ
                </span>
              </div>
            )}

            <div className="flex flex-wrap sm:flex-nowrap items-stretch gap-2.5 sm:gap-3">
              {/* Quantity selector */}
              <div className="flex items-center border border-forest-800/35 rounded-xl bg-white h-12 shrink-0 overflow-hidden shadow-xs">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="w-10 sm:w-11 h-full flex items-center justify-center text-forest-800 hover:text-black hover:bg-forest-100/80 active:scale-90 disabled:opacity-25 disabled:hover:bg-transparent disabled:active:scale-100 transition-all cursor-pointer"
                  aria-label="Giảm số lượng"
                >
                  <Minus className="w-4 h-4 stroke-[2.5]" />
                </button>
                <span className="font-ui font-bold text-base sm:text-lg text-forest-950 min-w-[2.5rem] text-center select-none">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(selectedVariant && selectedProduct.manageStock
                    ? Math.min(selectedVariant.stock, quantity + 1)
                    : quantity + 1)}
                  disabled={selectedVariant && selectedProduct.manageStock ? quantity >= selectedVariant.stock : false}
                  className="w-10 sm:w-11 h-full flex items-center justify-center text-forest-800 hover:text-black hover:bg-forest-100/80 active:scale-90 disabled:opacity-25 disabled:hover:bg-transparent disabled:active:scale-100 transition-all cursor-pointer"
                  aria-label="Tăng số lượng"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                type="button"
                onClick={handleAdd}
                disabled={!canBuy}
                className="flex-1 min-w-[145px] h-12 px-4 border-2 border-forest-800 hover:bg-forest-900 hover:text-white bg-white disabled:cursor-not-allowed disabled:opacity-50 text-forest-950 font-ui text-sm font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-xs hover:shadow cursor-pointer whitespace-nowrap active:scale-[0.99] group"
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                    <span>Đã thêm!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" strokeWidth={2} />
                    <span>{canBuy ? "Thêm vào giỏ" : "Tạm hết hàng"}</span>
                  </>
                )}
              </button>

              {/* Buy Now Button */}
              <button
                type="button"
                onClick={handleBuyNow}
                disabled={!canBuy}
                className="w-full sm:w-auto sm:flex-1 h-12 px-5 bg-forest-950 hover:bg-[#9d753d] disabled:cursor-not-allowed disabled:opacity-50 text-white font-ui text-sm font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-lg active:scale-[0.99] cursor-pointer whitespace-nowrap group"
              >
                <span>Mua ngay</span>
                <ArrowRight className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-1" strokeWidth={2.2} />
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
