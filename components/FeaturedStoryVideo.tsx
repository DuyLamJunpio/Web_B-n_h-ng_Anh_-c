"use client";

import { useRef, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Bookmark,
  Check,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  ShoppingBag,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useCart } from "@/lib/CartContext";
import type { Product } from "@/lib/data";
import { categoryAndDescendantSlugs } from "@/lib/categoryFilters";

const PALO_SANTO_STORY = {
  eyebrow: "Khoảng lặng thường nhật",
  title: "Câu chuyện về gỗ thiêng",
  subtitle:
    "Gỗ Palo santo - hay còn được gọi là: gỗ thánh. Được khai thác trong những cánh rừng già ở Peru. Palo Santo ủ một lớp tinh dầu thơm trong từng thớ gỗ. Chờ toả hương",
  videoSrc: "/videos/palo-santo-video.mp4",
  ctaText: "Khám phá gỗ Palo Santo",
};

export default function FeaturedStoryVideo() {
  const { products, categories, addToCart, openProductModal, setCartOpen } = useCart();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [addedId, setAddedId] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [scrollProgress, setScrollProgress] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const productScrollRef = useRef<HTMLDivElement>(null);

  const handleProductScroll = () => {
    if (!productScrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = productScrollRef.current;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll > 0) {
      setScrollProgress(scrollLeft / maxScroll);
    }
  };
  const storyProductCategory = products.find((product) => /palo\s*santo/i.test(product.name))?.category;
  const storyCategory = categories.find((category) => category.slug === storyProductCategory);
  const storyHref = storyCategory
    ? `/san-pham?category=${encodeURIComponent(storyCategory.slug)}`
    : "/san-pham";

  const handleBuyNow = (product: Product) => {
    addToCart(product.id);
    setCartOpen(true);
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const handleTabClick = (tabId: string, event?: React.MouseEvent<HTMLButtonElement>) => {
    setActiveTab(tabId);
    event?.currentTarget.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  };

  // Category tabs follow the same category list as the rest of the shop.
  const categoryTabs = useMemo(() => {
    return [
      { id: "all", label: "Tất cả" },
      ...categories.map((category) => ({ id: category.slug, label: category.name })),
    ];
  }, [categories]);

  // Products filtered according to tab
  const filteredProducts = useMemo(() => {
    if (activeTab === "all") return products;
    const slugs = categoryAndDescendantSlugs(categories, activeTab);
    return products.filter((product) => slugs.has(product.category));
  }, [products, categories, activeTab]);

  const handleAddToCart = (product: Product) => {
    addToCart(product.id);
    setAddedId(product.id);
    window.setTimeout(() => setAddedId(null), 1600);
  };

  const toggleBookmark = (id: string) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const scrollProducts = (direction: "left" | "right") => {
    if (!productScrollRef.current) return;
    const container = productScrollRef.current;
    const cardWidth = container.querySelector<HTMLElement>("[data-product-card]")?.offsetWidth || 280;
    const scrollAmount = cardWidth + 24;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section
      id="featured-story-video"
      aria-label="Không gian câu chuyện và sản phẩm"
      className="border-b border-[#282723]/15 bg-[#faf8f5] text-[#282724] overflow-hidden"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[640px] lg:min-h-[740px]">
        {/* ============================================================ */}
        {/* LEFT COLUMN: Ambient Cinematic Video with Editorial Overlay  */}
        {/* ============================================================ */}
        <div className="relative min-h-[520px] sm:min-h-[580px] lg:min-h-full bg-[#181715] flex flex-col justify-between p-6 sm:p-10 lg:p-12 overflow-hidden group/video">
          {/* Background Video */}
          <video
            ref={videoRef}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            key={PALO_SANTO_STORY.videoSrc}
            className="absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700"
          >
            <source src={PALO_SANTO_STORY.videoSrc} type="video/mp4" />
          </video>

          {/* Deep Dark Gradient Overlay for Supreme Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/20 pointer-events-none" />

          {/* Top Live Pill */}
          <div className="relative z-10 flex items-center justify-center sm:justify-start">
            <div className="flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-md px-4 py-1.5 border border-white/20 text-white text-xs tracking-wider uppercase">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Gỗ thánh Palo Santo tự nhiên</span>
            </div>
          </div>

          {/* Bottom Overlay: Title, Subtitle, CTA & Play/Mute Controls */}
          <div className="relative z-10 mt-auto pt-24 text-white text-center sm:text-left flex flex-col items-center sm:items-start">
            <p
              style={{ color: "#e5caa1" }}
              className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] !text-[#e5caa1] drop-shadow-sm mx-auto sm:mx-0"
            >
              {PALO_SANTO_STORY.eyebrow}
            </p>

            <h2
              style={{ color: "#ffffff" }}
              className="mt-3 text-2xl sm:text-3xl lg:text-[2.25rem] font-normal leading-[1.15] tracking-[-0.03em] !text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)] mx-auto sm:mx-0"
            >
              {PALO_SANTO_STORY.title}
            </h2>

            <p
              style={{ color: "#ffffff" }}
              className="mt-4 max-w-xl text-base sm:text-lg leading-relaxed !text-white/95 font-light drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)] mx-auto sm:mx-0"
            >
              {PALO_SANTO_STORY.subtitle}
            </p>

            {/* Explore Button and Video Controls Bar */}
            <div className="mt-8 flex flex-wrap items-center justify-center sm:justify-between gap-4 w-full">
              <Link
                href={storyHref}
                className="inline-flex items-center gap-2 border border-white/80 px-6 py-3.5 text-xs sm:text-sm font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-sm transition-all duration-300 hover:bg-white hover:text-black hover:border-white shadow-sm"
              >
                <span>{PALO_SANTO_STORY.ctaText}</span>
                <span>→</span>
              </Link>

              {/* Bottom Video Controls (Pause / Sound) */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={togglePlay}
                  aria-label={isPlaying ? "Tạm dừng video" : "Phát video"}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/40 text-white backdrop-blur-md transition-all hover:bg-white hover:text-black cursor-pointer"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current ml-0.5" />}
                </button>

                <button
                  type="button"
                  onClick={toggleMute}
                  aria-label={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
                  className={`flex h-10 w-10 items-center justify-center rounded-full border backdrop-blur-md transition-all cursor-pointer ${
                    !isMuted
                      ? "border-[#e5caa1] bg-[#e5caa1]/30 text-[#f7e4c6]"
                      : "border-white/30 bg-black/40 text-white hover:bg-white hover:text-black"
                  }`}
                >
                  {!isMuted ? <Volume2 className="h-4 w-4 text-[#e5caa1] animate-pulse" /> : <VolumeX className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* RIGHT COLUMN: Aesop-Style Product Showcase & Carousel        */}
        {/* ============================================================ */}
        <div className="flex flex-col justify-between p-6 sm:p-10 lg:p-14 xl:p-16">
          <div className="text-center sm:text-left flex flex-col items-center sm:items-start">
            {/* Header Eyebrow & Title */}
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-[#9d753d] mx-auto sm:mx-0">
              Vật phẩm mộc & Hương thơm
            </p>

            <h2 className="mt-3 text-2xl sm:text-3xl lg:text-[2.25rem] font-normal leading-[1.15] tracking-[-0.03em] text-[#282724] mx-auto sm:mx-0">
              Hương thơm & câu chuyện cho tất cả
            </h2>

            <p className="mt-4 max-w-xl text-base sm:text-lg leading-relaxed text-[#504c44] mx-auto sm:mx-0">
              Khám phá những công thức mộc mạc và hương thơm tự nhiên, nâng niu không gian sống và mở ra khoảng lặng an yên cho tâm trí.
            </p>

            {/* Category Filter Tabs (Aesop tab style with underline) */}
            <div className="mt-8 flex items-center justify-start gap-6 sm:gap-8 border-b border-[#282723]/15 overflow-x-auto no-scrollbar w-full -mx-6 px-6 sm:mx-0 sm:px-0 scroll-smooth">
              {categoryTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={(e) => handleTabClick(tab.id, e)}
                  className={`relative shrink-0 pb-3 text-base font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    activeTab === tab.id ? "text-[#282724] font-semibold" : "text-[#77736b] hover:text-[#282724]"
                  }`}
                >
                  <span>{tab.label}</span>
                  {activeTab === tab.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#282724]" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Product Carousel Viewport */}
          <div className="relative mt-8 group/carousel">
            {/* Left Carousel Arrow */}
            <button
              type="button"
              onClick={() => scrollProducts("left")}
              aria-label="Cuộn sản phẩm sang trái"
              className="absolute -left-3 sm:-left-4 top-[35%] -translate-y-1/2 z-20 hidden sm:flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-white/90 text-[#282724] shadow-md border border-[#282723]/15 backdrop-blur-sm transition-all hover:bg-white hover:scale-105 active:scale-95 cursor-pointer"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {/* Right Carousel Arrow */}
            <button
              type="button"
              onClick={() => scrollProducts("right")}
              aria-label="Cuộn sản phẩm sang phải"
              className="absolute -right-3 sm:-right-4 top-[35%] -translate-y-1/2 z-20 hidden sm:flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-white/90 text-[#282724] shadow-md border border-[#282723]/15 backdrop-blur-sm transition-all hover:bg-white hover:scale-105 active:scale-95 cursor-pointer"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            {/* Horizontal Product Cards Row */}
            <div
              ref={productScrollRef}
              onScroll={handleProductScroll}
              className="no-scrollbar flex gap-5 sm:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory py-2 -mx-2 px-2"
            >
              {filteredProducts.length === 0 && (
                <p className="py-16 text-sm text-[#625f57]">Danh mục này hiện chưa có sản phẩm.</p>
              )}
              {filteredProducts.map((product) => {
                const isSaved = savedIds.has(product.id);
                return (
                  <div
                    key={product.id}
                    data-product-card
                    className="w-[76vw] sm:w-[270px] lg:w-[280px] shrink-0 snap-center sm:snap-start flex flex-col justify-between group/card"
                  >
                    {/* Top Header inside card: Badge & Bookmark */}
                    <div className="flex items-center justify-between pb-2">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9d753d]">
                        {product.badge || "Tuyển chọn"}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleBookmark(product.id)}
                        aria-label="Lưu sản phẩm"
                        className="text-[#8c887f] transition-colors hover:text-[#282724] cursor-pointer"
                      >
                        <Bookmark
                          className={`h-4 w-4 ${isSaved ? "fill-[#9d753d] text-[#9d753d]" : ""}`}
                          strokeWidth={1.5}
                        />
                      </button>
                    </div>

                    {/* Product Image Frame */}
                    <div
                      onClick={() => openProductModal(product.id)}
                      className="relative aspect-[0.9/1] overflow-hidden rounded-xl bg-[#f2ede4] shadow-sm transition-all duration-500 group-hover/card:shadow-md cursor-pointer"
                    >
                      <Image
                        src={product.image}
                        unoptimized
                        alt={product.name}
                        fill
                        sizes="(min-width: 1024px) 280px, 240px"
                        className="object-cover object-center transition-transform duration-700 ease-out group-hover/card:scale-[1.06]"
                      />
                    </div>

                    {/* Product Information */}
                    <div className="pt-4 flex flex-1 flex-col justify-between">
                      <div>
                        <h3
                          onClick={() => openProductModal(product.id)}
                          className="text-lg sm:text-xl font-semibold leading-snug tracking-[-0.02em] text-[#282724] transition-colors hover:text-[#9d753d] cursor-pointer line-clamp-2"
                        >
                          {product.name}
                        </h3>

                        <p className="mt-1 text-xs sm:text-sm text-[#504c44] line-clamp-1 italic font-serif">
                          {product.notes}
                        </p>
                      </div>

                      {/* Price & Action Button */}
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-1.5 border-t border-[#282723]/10 pt-3">
                        <span className="text-base sm:text-lg font-bold text-[#282724] tracking-tight">
                          {product.price.toLocaleString("vi-VN")} đ
                        </span>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleAddToCart(product)}
                            className="inline-flex items-center gap-1 rounded-full border border-[#282723]/25 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#282724] transition-all hover:bg-[#282724] hover:text-white active:scale-95 cursor-pointer"
                          >
                            {addedId === product.id ? (
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
                            onClick={() => handleBuyNow(product)}
                            className="inline-flex items-center gap-1 rounded-full bg-[#282724] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-all hover:bg-[#9d753d] active:scale-95 cursor-pointer shadow-xs"
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

            {/* Minimalist Progress Track */}
            <div className="mt-8 flex items-center justify-center">
              <div className="h-[2px] w-40 sm:w-56 bg-[#24231f]/12 relative overflow-hidden rounded-full">
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
      </div>
    </section>
  );
}
