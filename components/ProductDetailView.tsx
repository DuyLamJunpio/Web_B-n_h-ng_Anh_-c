"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Star,
  Check,
  ShoppingBag,
  Truck,
  Shield,
  Sparkles,
  ArrowRight,
  Flame,
  Minus,
  Plus,
} from "lucide-react";
import type { Product } from "@/lib/data";
import { useCart } from "@/lib/CartContext";

export default function ProductDetailView({ product, relatedProducts }: { product: Product; relatedProducts: Product[] }) {
  const router = useRouter();
  const { addToCart, setCartOpen, storefrontContent } = useCart();
  const [activeImage, setActiveImage] = useState<string>(product.image);
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdded, setIsAdded] = useState(false);
  const availableVariants = (product.variants ?? []).filter((variant) => variant.available);
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    availableVariants[0]?.id ?? product.variants?.[0]?.id ?? ""
  );
  const selectedVariant = (product.variants ?? []).find((variant) => variant.id === selectedVariantId) ?? availableVariants[0];
  const currentPrice = selectedVariant?.price ?? product.price;
  const canBuy = product.inStock !== false && (availableVariants.length > 0 || !(product.variants?.length));
  const isDefaultVariantOnly =
    (product.variants?.length === 1) &&
    ["mặc định", "mặc định / mặc định", "default"].includes(
      (product.variants[0].label || "").trim().toLowerCase()
    );
  const hasVisibleVariants = product.hasVariants ?? (
    (product.variants?.length ?? 0) > 1 ||
    ((product.variants?.length ?? 0) === 1 && !isDefaultVariantOnly)
  );
  const hasDiscount = Boolean(product.originalPrice && product.originalPrice > currentPrice);
  const discountPercent = product.discountPercent ?? (
    hasDiscount && product.originalPrice
      ? Math.round(((product.originalPrice - currentPrice) / product.originalPrice) * 100)
      : 0
  );
  const totalPrice = currentPrice * quantity;
  const totalOriginalPrice = (product.originalPrice ?? 0) * quantity;

  const shippingMessage = Object.values(storefrontContent.sales).some((method) => method.enabled && method.free_shipping)
    ? "Miễn phí giao hàng"
    : "Phí giao hàng tính theo phương thức thanh toán";

  const handleAddToCart = () => {
    const added = addToCart(product.id, selectedVariant?.id, quantity);
    if (!added) return;
    setIsAdded(true);
    window.setTimeout(() => setIsAdded(false), 1800);
  };

  const handleBuyNow = () => {
    const added = addToCart(product.id, selectedVariant?.id, quantity);
    if (!added) return;
    setCartOpen(false);
    router.push("/thanh-toan");
  };

  const images = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];
  const media = [...images, ...(product.videos ?? [])];
  const activeIsVideo = product.videos?.includes(activeImage) ?? false;

  return (
    <main className="min-h-screen bg-[#f3f0e8] text-[#24231f]">
      {/* 1. BREADCRUMBS */}
      <div className="border-b border-[#282723]/10 bg-[#ebe7dd]/50 px-5 pt-32 pb-4 sm:px-8 lg:px-12 sm:pt-40 lg:pt-48">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-center sm:justify-start gap-2 text-xs uppercase tracking-[0.16em] text-[#77736b]">
          <Link href="/" className="transition-colors hover:text-[#24231f]">Trang chủ</Link>
          <span>/</span>
          <Link href="/san-pham" className="transition-colors hover:text-[#24231f]">Sản phẩm</Link>
          <span>/</span>
          <span className="text-[#9d753d]">{product.categoryName}</span>
          <span>/</span>
          <span className="text-[#24231f] font-medium truncate max-w-[240px]">{product.name}</span>
        </div>
      </div>

      {/* 2. MAIN PRODUCT SECTION (Aesop Apothecary Style) */}
      <section className="mx-auto max-w-[1400px] px-5 py-12 sm:px-8 lg:px-12 sm:py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left: Gallery (7 Cols) */}
          <div className="space-y-6 lg:col-span-7">
            {/* Main Stage Image */}
            <div className="relative aspect-[1/1.05] w-full overflow-hidden border border-[#282723]/15 bg-[#faf8f5]">
              {activeIsVideo ? (
                <video key={activeImage} src={activeImage} controls playsInline className="h-full w-full object-contain" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={activeImage}
                  alt={product.name}
                  className="h-full w-full object-cover object-center transition-all duration-500"
                />
              )}

              <div className="absolute left-5 top-5 sm:left-6 sm:top-6 flex flex-col gap-2 items-start z-10 pointer-events-none">
                {hasDiscount && discountPercent > 0 && (
                  <span className="rounded-lg bg-red-600 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-md flex items-center gap-1.5 animate-pulse">
                    <Flame className="w-3.5 h-3.5 fill-current" />
                    Giảm {discountPercent}%
                  </span>
                )}
                {product.badge && (
                  <span className="border border-[#282723]/20 bg-[#faf8f5]/95 backdrop-blur-xs px-3 py-1.5 text-xs uppercase tracking-[0.18em] text-[#24231f] shadow-xs">
                    {product.badge}
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail Strip */}
            {media.length > 1 && (
              <div className="flex gap-4 overflow-x-auto justify-start pb-2">
                {media.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImage(img)}
                    className={`relative aspect-square w-20 flex-shrink-0 overflow-hidden border transition-all cursor-pointer ${
                      activeImage === img
                        ? "border-[#282723] ring-2 ring-[#9d753d]/40"
                        : "border-[#282723]/20 opacity-70 hover:opacity-100"
                    }`}
                  >
                    {product.videos?.includes(img) ? (
                      <span className="flex h-full w-full items-center justify-center bg-[#282723] text-xs text-white">Video</span>
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={img} alt={`Góc nhìn ${idx + 1}`} className="h-full w-full object-cover" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Formulation Details & Purchase (5 Cols) */}
          <div className="flex flex-col lg:col-span-5 text-center sm:text-left items-center sm:items-start">
            {/* Category & Origin */}
            <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-1 text-xs w-full">
              <span className="uppercase tracking-[0.2em] text-[#9d753d] font-semibold">
                {product.categoryName}{product.origin ? ` • ${product.origin}` : ""}
              </span>
              {product.rating > 0 ? (
                <div className="flex items-center gap-1.5 text-xs text-[#24231f]">
                  <Star className="h-3.5 w-3.5 fill-[#9d753d] text-[#9d753d]" />
                  <span className="font-medium">{product.rating}</span>
                  <span className="text-[#77736b]">({product.reviewsCount} đánh giá)</span>
                </div>
              ) : (product.soldCount ?? 0) > 0 ? (
                <span className="text-[#77736b]">Đã bán {product.soldCount}</span>
              ) : null}
            </div>

            {/* Product Title */}
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.025em] text-[#1b1a18] sm:text-4xl lg:text-[2.5rem] leading-tight">
              {product.name}
            </h1>

            {/* Scent Summary Line */}
            {product.notes && (
              <p className="mt-2 text-sm sm:text-[15px] italic text-[#625f57] font-serif">
                ✦ {product.notes}
              </p>
            )}

            {/* Price Box with Discount */}
            <div className="mt-6 w-full text-center sm:text-left">
              {hasDiscount ? (
                <div className="rounded-2xl border border-red-200/90 bg-gradient-to-br from-red-50/90 via-[#faf8f5] to-amber-50/40 p-4 sm:p-5 shadow-xs space-y-2">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span className="inline-flex items-center gap-1 rounded-md bg-red-600 px-2.5 py-0.5 text-xs font-bold text-white shadow-xs tracking-wider uppercase">
                      <Flame className="w-3.5 h-3.5 fill-current" />
                      Giảm {discountPercent}%
                    </span>
                    <span className="text-xs font-semibold text-red-700 bg-red-100/70 border border-red-200 px-2 py-0.5 rounded-md">
                      Tiết kiệm {(totalOriginalPrice - totalPrice).toLocaleString("vi-VN")} đ
                    </span>
                  </div>

                  <div className="flex flex-wrap items-baseline justify-center sm:justify-start gap-3 pt-1">
                    <span className="text-3xl sm:text-4xl lg:text-[2.6rem] font-bold tracking-tight text-red-600 font-serif leading-none">
                      {totalPrice.toLocaleString("vi-VN")} đ
                    </span>
                    <div className="flex items-center gap-1.5 text-xs sm:text-sm text-[#77736b]">
                      <span>Giá gốc:</span>
                      <span className="line-through font-serif decoration-red-400/80 decoration-1.5 text-[#8c8273]">
                        {totalOriginalPrice.toLocaleString("vi-VN")} đ
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border-y border-[#282723]/15 py-4 flex items-baseline justify-center sm:justify-start gap-3">
                  <span className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1b1a18] font-serif">
                    {totalPrice.toLocaleString("vi-VN")} đ
                  </span>
                </div>
              )}
            </div>

            {/* Description & Detailed Information (Deduplicated & Prominent) */}
            <div className="mt-6 space-y-4 text-sm sm:text-base leading-relaxed text-[#282723]">
              {product.desc && (
                <p className="whitespace-pre-line leading-relaxed">{product.desc}</p>
              )}
              {product.detail && product.detail.trim() !== product.desc?.trim() && (
                <p className="whitespace-pre-line text-[#504c44] leading-relaxed">{product.detail}</p>
              )}
            </div>

            {/* Scent Pyramid Block (Aesop Olfactory Analysis) */}
            {product.scentPyramid && (
              <div className="mt-6 border border-[#282723]/15 bg-[#faf8f5] p-5 space-y-3 w-full text-left">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#9d753d]">
                  <Sparkles className="h-4 w-4" strokeWidth={1.5} />
                  <span>Cấu trúc tầng hương tự nhiên</span>
                </div>
                <div className="grid grid-cols-1 gap-2 text-xs text-[#5e5a52]">
                  <div><strong className="text-[#24231f]">Hương đầu:</strong> {product.scentPyramid.top}</div>
                  <div><strong className="text-[#24231f]">Hương giữa:</strong> {product.scentPyramid.middle}</div>
                  <div><strong className="text-[#24231f]">Hương cuối:</strong> {product.scentPyramid.base}</div>
                </div>
              </div>
            )}

            {/* Key Benefits */}
            {product.benefits && product.benefits.length > 0 && (
              <div className="mt-6 space-y-2 w-full text-left">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#24231f] block text-center sm:text-left">
                  Đặc tính & Công dụng
                </span>
                <div className="space-y-1.5 text-xs text-[#5e5a52]">
                  {product.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Check className="h-3.5 w-3.5 text-[#9d753d] shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Usage Instructions */}
            {product.usage && (
              <div className="mt-6 flex items-start gap-3 border-l-2 border-[#9d753d] bg-[#faf8f5]/70 p-4 text-xs text-[#5e5a52] w-full text-left">
                <Flame className="h-4 w-4 text-[#9d753d] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#24231f] block">Hướng dẫn nghi thức:</span>
                  <p className="mt-0.5">{product.usage}</p>
                </div>
              </div>
            )}

            {hasVisibleVariants && (
              <div className="mt-6 space-y-2 w-full text-center sm:text-left">
                <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-[#24231f]">
                  Chọn phân loại
                </span>
                <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                  {product.variants?.map((variant) => (
                    <button
                      key={variant.id}
                      type="button"
                      disabled={!variant.available}
                      onClick={() => {
                        setSelectedVariantId(variant.id);
                        setQuantity(1);
                      }}
                      className={`border px-3 py-2 text-xs transition-colors ${
                        selectedVariantId === variant.id
                          ? "border-[#282723] bg-[#282723] text-white"
                          : "border-[#282723]/25 bg-white text-[#24231f] hover:border-[#282723] disabled:cursor-not-allowed disabled:opacity-50"
                      }`}
                    >
                      {variant.label}{product.manageStock ? variant.available ? ` · còn ${variant.stock}` : " · hết hàng" : ""}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector & Add to Cart Button */}
            <div className="mt-8 space-y-4 pt-4 border-t border-[#282723]/15 w-full">
              <div className="flex flex-wrap sm:flex-nowrap items-stretch gap-2.5 sm:gap-3">
                {/* Quantity Control */}
                <div className="flex items-center border border-[#282723]/35 rounded-xl bg-white h-12 shrink-0 overflow-hidden shadow-xs">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="w-10 sm:w-11 h-full flex items-center justify-center text-[#282723] hover:text-black hover:bg-[#ede8dd]/80 active:scale-90 disabled:opacity-25 disabled:hover:bg-transparent disabled:active:scale-100 transition-all cursor-pointer"
                    aria-label="Giảm số lượng"
                  >
                    <Minus className="w-4 h-4 stroke-[2.5]" />
                  </button>
                  <span className="font-ui font-bold text-base sm:text-lg text-[#1b1a18] min-w-[2.5rem] text-center select-none">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(selectedVariant && product.manageStock
                      ? Math.min(selectedVariant.stock, quantity + 1)
                      : quantity + 1)}
                    disabled={selectedVariant && product.manageStock ? quantity >= selectedVariant.stock : false}
                    className="w-10 sm:w-11 h-full flex items-center justify-center text-[#282723] hover:text-black hover:bg-[#ede8dd]/80 active:scale-90 disabled:opacity-25 disabled:hover:bg-transparent disabled:active:scale-100 transition-all cursor-pointer"
                    aria-label="Tăng số lượng"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!canBuy}
                  className="flex-1 min-w-[145px] h-12 px-4 border-2 border-[#282723] hover:bg-[#282723] hover:text-white bg-white disabled:cursor-not-allowed disabled:opacity-50 text-[#1b1a18] font-ui text-sm sm:text-[15px] font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-xs hover:shadow cursor-pointer whitespace-nowrap active:scale-[0.99] group"
                >
                  {isAdded ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                      <span>Đã thêm vào giỏ!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-4 w-4 shrink-0 transition-transform group-hover:scale-110" strokeWidth={2} />
                      <span>{canBuy ? "Thêm vào giỏ" : "Tạm hết hàng"}</span>
                    </>
                  )}
                </button>

                {/* Buy Now Button */}
                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={!canBuy}
                  className="w-full sm:w-auto sm:flex-1 h-12 px-5 bg-[#1b1a18] hover:bg-[#9d753d] disabled:cursor-not-allowed disabled:opacity-50 text-white font-ui text-sm sm:text-[15px] font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-lg active:scale-[0.99] cursor-pointer whitespace-nowrap group"
                >
                  <span>Mua ngay</span>
                  <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" strokeWidth={2.2} />
                </button>
              </div>

              {/* Assurances */}
              <div className="flex flex-wrap items-center justify-center sm:justify-between gap-2 border-t border-[#282723]/10 pt-3 text-[11px] text-[#77736b]">
                <span className="flex items-center gap-1.5">
                  <Truck className="h-3.5 w-3.5 text-[#9d753d]" />
                  {shippingMessage}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5 text-[#9d753d]" />
                  Đổi trả trong 7 ngày
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. RECOMMENDED PAIRINGS / RELATED PRODUCTS (Aesop Accompanying Formulations) */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-[#282723]/15 bg-[#faf8f5] px-5 py-16 sm:px-8 lg:px-12 sm:py-24">
          <div className="mx-auto max-w-[1400px]">
            <div className="mb-10 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 text-center sm:text-left">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9d753d]">
                  Gợi ý kết hợp
                </p>
                <h3 className="mt-2 text-2xl font-light tracking-[-0.03em] sm:text-3xl">
                  Những vật phẩm hòa hợp cùng nhau
                </h3>
              </div>
              <Link
                href="/san-pham"
                className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-[#24231f] underline underline-offset-4 hover:text-[#9d753d]"
              >
                <span>Xem tất cả sản phẩm</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProducts.slice(0, 3).map((item) => (
                <article
                  key={item.id}
                  className="group flex flex-col border border-[#282723]/10 bg-white p-5 transition-shadow hover:shadow-[0_10px_30px_rgba(36,35,31,0.08)]"
                >
                  <Link href={`/san-pham/${item.id}`} className="relative block aspect-square overflow-hidden bg-[#f3f0e8]/60 p-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                    {item.originalPrice && item.originalPrice > item.price && (
                      <span className="absolute top-2.5 left-2.5 rounded-md bg-red-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-md flex items-center gap-1">
                        <Flame className="w-2.5 h-2.5 fill-current" />
                        -{item.discountPercent ?? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}%
                      </span>
                    )}
                  </Link>

                  <div className="mt-4 flex flex-1 flex-col text-center sm:text-left items-center sm:items-start">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9d753d]">
                      {item.categoryName}
                    </span>
                    <h4 className="mt-1 text-sm font-medium tracking-tight text-[#24231f]">
                      <Link href={`/san-pham/${item.id}`} className="transition-colors hover:text-[#9d753d]">
                        {item.name}
                      </Link>
                    </h4>
                    <p className="mt-1 text-xs text-[#77736b] line-clamp-2">{item.notes}</p>

                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-[#282723]/10 w-full">
                      {item.originalPrice && item.originalPrice > item.price ? (
                        <div className="flex flex-col items-start gap-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-[#8c8273] line-through font-serif decoration-red-400">
                              {item.originalPrice.toLocaleString("vi-VN")}đ
                            </span>
                            <span className="text-[9px] font-bold text-white bg-red-600 px-1 py-0.2 rounded shadow-2xs">
                              -{item.discountPercent ?? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}%
                            </span>
                          </div>
                          <span className="text-sm font-bold text-red-600">
                            {item.price.toLocaleString("vi-VN")}đ
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs font-medium">{item.price.toLocaleString("vi-VN")}đ</span>
                      )}
                      <Link
                        href={`/san-pham/${item.id}`}
                        className="inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-[0.12em] text-[#24231f] hover:text-[#9d753d]"
                      >
                        <span>Chi tiết</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. EDITORIAL STORY BANNER */}
      <section className="border-t border-[#282723]/15 bg-[#e8e4da] px-5 py-16 sm:px-8 lg:px-12 sm:py-20 text-center">
        <div className="mx-auto max-w-2xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9d753d]">
            Thư viện câu chuyện RUNGU
          </p>
          <h3 className="mt-3 text-2xl font-light tracking-[-0.03em] sm:text-3xl text-[#24231f]">
            Mỗi vật phẩm mang một ký ức từ rừng già
          </h3>
          <p className="mt-4 text-xs leading-relaxed text-[#5e5a52] sm:text-sm">
            Chúng tôi tin rằng hiểu về nguồn gốc của thân gỗ, ngọn lửa hay chiếc khay gốm thủ công sẽ làm cho khoảnh khắc thắp hương mỗi ngày trở nên ý nghĩa hơn.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/story/tay-tang-huyen-bi"
              className="border border-[#282723] bg-[#282723] px-6 py-2.5 text-xs font-medium uppercase tracking-[0.16em] text-white transition-colors hover:bg-black"
            >
              Đọc câu chuyện sản phẩm
            </Link>
            <Link
              href="/san-pham"
              className="border border-[#282723] px-6 py-2.5 text-xs font-medium uppercase tracking-[0.16em] text-[#24231f] transition-colors hover:bg-white"
            >
              Quay lại danh mục sản phẩm
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
