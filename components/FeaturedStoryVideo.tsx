"use client";

import { useRef, useState, useEffect, useMemo } from "react";
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

interface VideoStory {
  id: string;
  tabId: string;
  tabLabel: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  videoSrc: string;
  link: string;
  ctaText: string;
  filterCategory: string;
}

const VIDEO_STORIES: VideoStory[] = [
  {
    id: "hoa-co",
    tabId: "floral",
    tabLabel: "Hoa cỏ",
    eyebrow: "Nốt hương & Câu chuyện",
    title: "Câu chuyện về hoa cỏ tự nhiên",
    subtitle:
      "Mỗi loại hoa, cỏ lại có một mùi hương riêng. Chúng mình để tự nhiên xoa dịu tâm hồn bạn bằng chính những làn hương mộc mạc nhất.",
    videoSrc: "/videos/hoa-co.mp4",
    link: "/san-pham?category=calm",
    ctaText: "Khám phá câu chuyện",
    filterCategory: "calm",
  },
  {
    id: "huong-mau",
    tabId: "warmth",
    tabLabel: "Hương màu",
    eyebrow: "Nghi thức sắc màu & ánh lửa",
    title: "Vũ điệu sắc màu và ánh sáng",
    subtitle:
      "Ánh nến lung linh cùng sáp tự nhiên tạo nên không gian ấm cúng, dẫn lối tâm trí trở về với sự an yên, dịu êm sau ngày dài.",
    videoSrc: "/videos/huong-mau.mp4",
    link: "/san-pham?category=warmth",
    ctaText: "Khám phá nến thơm",
    filterCategory: "warmth",
  },
  {
    id: "thuong-ngay",
    tabId: "purify",
    tabLabel: "Thường ngày",
    eyebrow: "Khoảng lặng thường nhật",
    title: "Khoảnh khắc bình dị thường ngày",
    subtitle:
      "Khói thơm tự nhiên từ Palo Santo và nhang mộc thanh lọc không gian, thiết lập lại nhịp thở và tái tạo nguồn năng lượng tích cực.",
    videoSrc: "/videos/thuong-ngay.mp4",
    link: "/san-pham?category=purify",
    ctaText: "Khám phá nghi thức",
    filterCategory: "purify",
  },
];

export default function FeaturedStoryVideo() {
  const { products, addToCart, openProductModal } = useCart();
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [addedId, setAddedId] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  const videoRef = useRef<HTMLVideoElement>(null);
  const productScrollRef = useRef<HTMLDivElement>(null);

  const currentVideo = VIDEO_STORIES[activeVideoIndex];

  // Reload and play video when activeVideoIndex changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {
        // Autoplay may need user gesture or muted
      });
      setIsPlaying(true);
    }
  }, [activeVideoIndex]);

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

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
  };

  // Dynamically derive category tabs from products
  const categoryTabs = useMemo(() => {
    const dynamicCategories = Array.from(
      new Map(products.map((p) => [p.category, p.categoryName || p.category])).entries()
    ).map(([id, label]) => ({ id, label }));

    if (dynamicCategories.length > 0) {
      return [{ id: "all", label: "Tất cả" }, ...dynamicCategories];
    }

    return [
      { id: "all", label: "Tất cả" },
      { id: "calm", label: "Hoa cỏ" },
      { id: "warmth", label: "Hương màu" },
      { id: "purify", label: "Thường ngày" },
    ];
  }, [products]);

  // Products filtered according to tab
  const filteredProducts = useMemo(() => {
    if (activeTab === "all") return products;
    return products.filter((p) => p.category === activeTab);
  }, [products, activeTab]);

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
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] xl:grid-cols-[45%_55%] min-h-[640px] lg:min-h-[720px]">
        {/* ============================================================ */}
        {/* LEFT COLUMN: Ambient Cinematic Video with Editorial Overlay  */}
        {/* ============================================================ */}
        <div className="relative min-h-[520px] sm:min-h-[580px] lg:min-h-full bg-[#181715] flex flex-col justify-between p-6 sm:p-10 lg:p-12 overflow-hidden group/video">
          {/* Background Video (supports both landscape & portrait) */}
          <video
            ref={videoRef}
            autoPlay
            muted={isMuted}
            playsInline
            onEnded={() => {
              setActiveVideoIndex((prev) => (prev + 1) % VIDEO_STORIES.length);
            }}
            key={currentVideo.videoSrc}
            className="absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700"
          >
            <source src={currentVideo.videoSrc} type="video/mp4" />
          </video>

          {/* Deep Dark Gradient Overlay for Supreme Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/20 pointer-events-none" />

          {/* Top Video Indicator - 3 subtle progress dashes for the 3 loop videos */}
          <div className="relative z-10 flex items-center gap-2">
            {VIDEO_STORIES.map((_, idx) => (
              <div
                key={idx}
                className={`h-0.5 rounded-full transition-all duration-500 ${
                  activeVideoIndex === idx ? "w-8 bg-white" : "w-2.5 bg-white/30"
                }`}
              />
            ))}
          </div>

          {/* Bottom Overlay: Title, Subtitle, CTA & Play/Mute Controls */}
          <div className="relative z-10 mt-auto pt-24 text-white">
            <p
              style={{ color: "#e5caa1" }}
              className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] !text-[#e5caa1] drop-shadow-sm"
            >
              {currentVideo.eyebrow}
            </p>

            <h2
              style={{ color: "#ffffff" }}
              className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-normal leading-[1.12] tracking-[-0.03em] !text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)]"
            >
              {currentVideo.title}
            </h2>

            <p
              style={{ color: "#ffffff" }}
              className="mt-4 max-w-xl text-base sm:text-lg leading-relaxed !text-white/95 font-light drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]"
            >
              {currentVideo.subtitle}
            </p>

            {/* Explore Button and Video Controls Bar */}
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
              <Link
                href={currentVideo.link}
                className="inline-flex items-center gap-2 border border-white/80 px-6 py-3.5 text-xs sm:text-sm font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-sm transition-all duration-300 hover:bg-white hover:text-black hover:border-white shadow-sm"
              >
                <span>{currentVideo.ctaText}</span>
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
          <div>
            {/* Header Eyebrow & Title */}
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-[#9d753d]">
              Vật phẩm mộc & Hương thơm
            </p>

            <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-normal leading-[1.12] tracking-[-0.03em] text-[#282724]">
              Hương thơm & câu chuyện cho tất cả
            </h2>

            <p className="mt-4 max-w-xl text-base sm:text-lg leading-relaxed text-[#504c44]">
              Khám phá những công thức mộc mạc và hương thơm tự nhiên, nâng niu không gian sống và mở ra khoảng lặng an yên cho tâm trí.
            </p>

            {/* Category Filter Tabs (Aesop tab style with underline) */}
            <div className="mt-8 flex items-center gap-6 sm:gap-8 border-b border-[#282723]/15 overflow-x-auto no-scrollbar">
              {categoryTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabClick(tab.id)}
                  className={`relative pb-3 text-base font-medium transition-colors whitespace-nowrap cursor-pointer ${
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
              className="absolute -left-3 sm:-left-4 top-[35%] -translate-y-1/2 z-20 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-white/90 text-[#282724] shadow-md border border-[#282723]/15 backdrop-blur-sm transition-all hover:bg-white hover:scale-105 active:scale-95 cursor-pointer"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {/* Right Carousel Arrow */}
            <button
              type="button"
              onClick={() => scrollProducts("right")}
              aria-label="Cuộn sản phẩm sang phải"
              className="absolute -right-3 sm:-right-4 top-[35%] -translate-y-1/2 z-20 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-white/90 text-[#282724] shadow-md border border-[#282723]/15 backdrop-blur-sm transition-all hover:bg-white hover:scale-105 active:scale-95 cursor-pointer"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            {/* Horizontal Product Cards Row */}
            <div
              ref={productScrollRef}
              className="no-scrollbar flex gap-5 sm:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory py-2 -mx-2 px-2"
            >
              {filteredProducts.map((product) => {
                const isSaved = savedIds.has(product.id);
                return (
                  <div
                    key={product.id}
                    data-product-card
                    className="w-[240px] sm:w-[270px] lg:w-[280px] shrink-0 snap-start flex flex-col justify-between group/card"
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
                      <div className="mt-4 flex items-center justify-between border-t border-[#282723]/10 pt-3">
                        <span className="text-base sm:text-lg font-bold text-[#282724] tracking-tight">
                          {product.price.toLocaleString("vi-VN")} đ
                        </span>

                        <button
                          type="button"
                          onClick={() => handleAddToCart(product)}
                          className="inline-flex items-center gap-1.5 rounded-full border border-[#282723]/25 bg-white px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#282724] transition-all hover:bg-[#282724] hover:text-white active:scale-95 cursor-pointer"
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
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
