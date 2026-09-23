"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  SlidersHorizontal,
  X,
  Check,
  Eye,
  ShoppingBag,
  ArrowRight,
  ArrowUpRight,
  Grid2X2,
  Grid3X3,
  LayoutGrid,
  ChevronDown,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import type { Product } from "@/lib/data";
import { useCart } from "@/lib/CartContext";

const SCENT_OPTIONS = [
  { id: "go", label: "Gỗ mộc & Trầm", keyword: "gỗ" },
  { id: "khoi", label: "Khói ấm & Nhựa cây", keyword: "khói" },
  { id: "thaomoc", label: "Thảo mộc & Xô thơm", keyword: "thảo mộc" },
  { id: "chanh", label: "Chanh vàng & Bạc hà", keyword: "chanh" },
  { id: "reu", label: "Rêu ẩm & Đất sau mưa", keyword: "rêu" },
  { id: "bachxanh", label: "Bách xanh Tây Tạng", keyword: "bách xanh" },
];

const PRICE_RANGES = [
  { id: "all", label: "Tất cả mức giá" },
  { id: "under250", label: "Dưới 250.000đ" },
  { id: "250to400", label: "250.000đ – 400.000đ" },
  { id: "over400", label: "Trên 400.000đ" },
];

const SORT_OPTIONS = [
  { id: "featured", label: "Phù hợp nhất" },
  { id: "price-asc", label: "Giá: Thấp đến cao" },
  { id: "price-desc", label: "Giá: Cao đến thấp" },
  { id: "name-asc", label: "Tên: A – Z" },
];

export default function ShopAllPLP() {
  const searchParams = useSearchParams();
  const { products, addToCart, openProductModal, selectedCategory, setSelectedCategory } = useCart();

  // State filters
  const [selectedScents, setSelectedScents] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("all");
  const [selectedBadge, setSelectedBadge] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSortMenuOpen, setIsSortMenuOpen] = useState<boolean>(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState<boolean>(false);
  const [gridCols, setGridCols] = useState<2 | 3 | 4>(3);
  const [addedId, setAddedId] = useState<string | null>(null);

  // insertMode param (defaults to true matching Aesop's layout)
  const [insertMode, setInsertMode] = useState<boolean>(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const paramInsert = searchParams.get("insertMode");
      if (paramInsert !== null) {
        setInsertMode(paramInsert === "true");
      }
      const cat = searchParams.get("category");
      setSelectedCategory(cat || "all");

      const collection = searchParams.get("collection");
      setSelectedBadge(collection || "all");

      const q = searchParams.get("q");
      setSearchQuery(q || "");

      const sort = searchParams.get("sort");
      if (sort) {
        setSortBy(sort);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, [searchParams, setSelectedCategory]);

  // Categories list
  const categoryFilters = useMemo(() => {
    const map = new Map<string, { id: string; label: string; count: number }>();
    map.set("all", { id: "all", label: "Tất cả công thức", count: products.length });
    products.forEach((p) => {
      if (!map.has(p.category)) {
        map.set(p.category, { id: p.category, label: p.categoryName || p.category, count: 1 });
      } else {
        map.get(p.category)!.count += 1;
      }
    });
    return Array.from(map.values());
  }, [products]);

  // Handle scent filter toggle
  const toggleScent = (id: string) => {
    setSelectedScents((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Active filters count
  const activeFiltersCount =
    (selectedCategory !== "all" ? 1 : 0) +
    selectedScents.length +
    (selectedPriceRange !== "all" ? 1 : 0) +
    (selectedBadge !== "all" ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0);

  // Clear all filters
  const handleClearFilters = () => {
    setSelectedCategory("all");
    setSelectedScents([]);
    setSelectedPriceRange("all");
    setSelectedBadge("all");
    setSortBy("featured");
    setSearchQuery("");
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Category filter
        if (selectedCategory !== "all") {
          if (selectedCategory === "new") {
            const isNew = Boolean(
              product.badge?.includes("Mới") ||
              product.badge?.includes("Bán chạy") ||
              product.badge?.includes("Được yêu thích") ||
              product.rating >= 4.9
            );
            if (!isNew) return false;
          } else if (selectedCategory === "sale") {
            const isSale = Boolean(product.originalPrice && product.originalPrice > product.price);
            if (!isSale) return false;
          } else if (selectedCategory === "purify") {
            if (product.category !== "purify" && product.category !== "go-hoa-co" && product.category !== "huong-thom") return false;
          } else if (selectedCategory === "warmth") {
            if (product.category !== "warmth" && product.category !== "dat-va-da" && product.category !== "huong-thom") return false;
          } else if (selectedCategory === "energy") {
            if (product.category !== "energy" && product.category !== "phu-kien" && product.category !== "sang-tao") return false;
          } else if (product.category !== selectedCategory) {
            return false;
          }
        }

        // Price range filter
        if (selectedPriceRange === "under250" && product.price >= 250000) return false;
        if (selectedPriceRange === "250to400" && (product.price < 250000 || product.price > 400000)) return false;
        if (selectedPriceRange === "over400" && product.price <= 400000) return false;

        // Badge / collection filter
        if (selectedBadge === "new" && !product.badge?.includes("Mới") && product.rating < 4.9) return false;
        if (selectedBadge === "bestseller" && !product.badge?.includes("Bán chạy") && !product.badge?.includes("Được yêu thích")) return false;
        if (selectedBadge === "sale" && (!product.originalPrice || product.originalPrice <= product.price)) return false;

        // Scent profile filter
        if (selectedScents.length > 0) {
          const productText = `${product.notes} ${product.desc} ${product.scentPyramid?.top} ${product.scentPyramid?.middle}`.toLowerCase();
          const match = selectedScents.some((scentId) => {
            const scentObj = SCENT_OPTIONS.find((s) => s.id === scentId);
            return scentObj ? productText.includes(scentObj.keyword) : false;
          });
          if (!match) return false;
        }

        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matches =
            product.name.toLowerCase().includes(q) ||
            product.categoryName.toLowerCase().includes(q) ||
            product.notes.toLowerCase().includes(q) ||
            product.desc.toLowerCase().includes(q) ||
            product.detail.toLowerCase().includes(q);
          if (!matches) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "name-asc") return a.name.localeCompare(b.name, "vi");
        return 0;
      });
  }, [products, selectedCategory, selectedPriceRange, selectedBadge, selectedScents, sortBy, searchQuery]);

  const handleAddToCart = (product: Product) => {
    addToCart(product.id);
    setAddedId(product.id);
    window.setTimeout(() => setAddedId(null), 1600);
  };

  // Lock body scroll when filter drawer is open
  useEffect(() => {
    document.body.style.overflow = isFilterDrawerOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isFilterDrawerOpen]);

  return (
    <main className="min-h-screen bg-[#f3f0e8] text-[#24231f]">
      {/* 1. EDITORIAL HERO HEADER (Aesop Style) */}
      <section className="relative flex min-h-[44vh] items-end overflow-hidden bg-[#24221f] text-white">
        <Image
          src="/videos/palo-santo-poster.jpg"
          alt="Không gian tĩnh lặng của RUNGU"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#181715]/65 via-[#181715]/40 to-[#181715]/90" />

        <div className="relative mx-auto w-full max-w-[1540px] px-5 pb-12 pt-36 sm:px-8 lg:px-12 sm:pb-16 text-center sm:text-left flex flex-col items-center sm:items-start">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-[#d5b27d] mx-auto sm:mx-0">
            <Link href="/" className="transition-opacity hover:opacity-75">Trang chủ</Link>
            <span>/</span>
            <span>Cửa hàng</span>
          </div>

          <h1 className="mt-4 text-3xl sm:text-5xl lg:text-6xl font-normal tracking-[-0.03em] text-white mx-auto sm:mx-0">
            Tất cả sản phẩm
          </h1>

          <div className="mt-4 flex flex-col justify-between gap-4 border-t border-white/20 pt-4 sm:flex-row sm:items-end w-full">
            <p className="max-w-2xl text-sm sm:text-lg leading-relaxed text-white/90 mx-auto sm:mx-0">
              Các công thức tự nhiên cho không gian, thân thể và tâm trí. Tuyển chọn từ gỗ Palo Santo Peru ngã đổ tự nhiên, xô thơm trắng California, nhang trầm xứ Quảng và sáp đậu nành thủ công.
            </p>
            <span className="font-mono text-xs sm:text-sm uppercase tracking-[0.16em] text-white/80 mx-auto sm:mx-0">
              {filteredProducts.length} trên {products.length} công thức
            </span>
          </div>
        </div>
      </section>

      {/* 2. STICKY FILTER & SORT TOOLBAR */}
      <section className="sticky top-0 z-30 border-y border-[#282723]/15 bg-[#f3f0e8]/95 px-5 py-3 backdrop-blur-md sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1540px] flex-wrap items-center justify-between gap-4">
          {/* Left: Filter drawer button + Category pills */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setIsFilterDrawerOpen(true)}
              className="group flex items-center gap-2 border border-[#282723]/25 bg-white/70 px-3.5 py-2 text-xs font-medium transition-all hover:border-[#282723] hover:bg-white"
              aria-label="Mở bộ lọc"
            >
              <SlidersHorizontal className="h-3.5 w-3.5 text-[#282723]" strokeWidth={1.5} />
              <span>Bộ lọc</span>
              {activeFiltersCount > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#9d753d] text-[10px] font-bold text-white">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Quick Category Pills */}
            <div className="hidden items-center gap-1.5 md:flex">
              {categoryFilters.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`border px-3 py-1.5 text-xs transition-colors ${
                    selectedCategory === cat.id
                      ? "border-[#282723] bg-[#282723] text-white font-medium"
                      : "border-transparent text-[#625f57] hover:border-[#282723]/25 hover:text-[#282723]"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Sort dropdown & Grid view toggle */}
          <div className="ml-auto flex items-center gap-3">
            {/* Sort Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
                className="flex items-center gap-2 border border-[#282723]/20 bg-white/60 px-3 py-2 text-xs font-medium transition-colors hover:border-[#282723]"
                aria-expanded={isSortMenuOpen}
              >
                <span className="text-[#77736b]">Sắp xếp:</span>
                <span>{SORT_OPTIONS.find((s) => s.id === sortBy)?.label}</span>
                <ChevronDown className={`h-3 w-3 text-[#77736b] transition-transform ${isSortMenuOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {isSortMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full z-40 mt-1 w-48 border border-[#282723]/15 bg-[#f7f5f0] p-1 shadow-lg"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          setSortBy(opt.id);
                          setIsSortMenuOpen(false);
                        }}
                        className={`flex w-full items-center justify-between px-3 py-2 text-left text-xs transition-colors hover:bg-[#ede8dd] ${
                          sortBy === opt.id ? "font-semibold text-[#9d753d]" : "text-[#282723]"
                        }`}
                      >
                        <span>{opt.label}</span>
                        {sortBy === opt.id && <Check className="h-3.5 w-3.5" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Grid Switcher (Desktop) */}
            <div className="hidden items-center border border-[#282723]/20 bg-white/60 p-0.5 lg:flex">
              <button
                type="button"
                onClick={() => setGridCols(2)}
                title="Lưới 2 cột"
                className={`p-1.5 transition-colors ${gridCols === 2 ? "bg-[#282723] text-white" : "text-[#77736b] hover:text-[#282723]"}`}
              >
                <Grid2X2 className="h-3.5 w-3.5" strokeWidth={1.5} />
              </button>
              <button
                type="button"
                onClick={() => setGridCols(3)}
                title="Lưới 3 cột"
                className={`p-1.5 transition-colors ${gridCols === 3 ? "bg-[#282723] text-white" : "text-[#77736b] hover:text-[#282723]"}`}
              >
                <Grid3X3 className="h-3.5 w-3.5" strokeWidth={1.5} />
              </button>
              <button
                type="button"
                onClick={() => setGridCols(4)}
                title="Lưới 4 cột"
                className={`p-1.5 transition-colors ${gridCols === 4 ? "bg-[#282723] text-white" : "text-[#77736b] hover:text-[#282723]"}`}
              >
                <LayoutGrid className="h-3.5 w-3.5" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Active filters badges banner */}
      {activeFiltersCount > 0 && (
        <div className="border-b border-[#282723]/10 bg-[#ebe7dd]/70 px-5 py-2 sm:px-8 lg:px-12">
          <div className="mx-auto flex max-w-[1540px] flex-wrap items-center justify-center sm:justify-start gap-2 text-xs">
            <span className="text-[11px] text-[#77736b]">Đang lọc theo:</span>

            {selectedCategory !== "all" && (
              <span className="inline-flex items-center gap-1.5 border border-[#282723]/20 bg-white px-2.5 py-1 text-xs">
                <span>{categoryFilters.find((c) => c.id === selectedCategory)?.label || selectedCategory}</span>
                <button type="button" onClick={() => setSelectedCategory("all")} aria-label="Xóa lọc danh mục"><X className="h-3 w-3" /></button>
              </span>
            )}

            {selectedPriceRange !== "all" && (
              <span className="inline-flex items-center gap-1.5 border border-[#282723]/20 bg-white px-2.5 py-1 text-xs">
                <span>{PRICE_RANGES.find((p) => p.id === selectedPriceRange)?.label}</span>
                <button type="button" onClick={() => setSelectedPriceRange("all")} aria-label="Xóa lọc giá"><X className="h-3 w-3" /></button>
              </span>
            )}

            {selectedScents.map((scentId) => (
              <span key={scentId} className="inline-flex items-center gap-1.5 border border-[#282723]/20 bg-white px-2.5 py-1 text-xs">
                <span>{SCENT_OPTIONS.find((s) => s.id === scentId)?.label}</span>
                <button type="button" onClick={() => toggleScent(scentId)} aria-label="Xóa lọc mùi"><X className="h-3 w-3" /></button>
              </span>
            ))}

            {searchQuery.trim() && (
              <span className="inline-flex items-center gap-1.5 border border-[#282723]/20 bg-white px-2.5 py-1 text-xs">
                <span>Tìm kiếm: &ldquo;{searchQuery}&rdquo;</span>
                <button type="button" onClick={() => setSearchQuery("")} aria-label="Xóa từ khóa tìm kiếm"><X className="h-3 w-3" /></button>
              </span>
            )}

            <button
              type="button"
              onClick={handleClearFilters}
              className="sm:ml-auto inline-flex items-center gap-1 text-[11px] font-medium text-[#8d693a] underline underline-offset-4 hover:text-[#282723]"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Xóa tất cả</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. PRODUCT GRID + EDITORIAL INTERSTITIAL TILES (insertMode=true) */}
      <section className="mx-auto max-w-[1540px] px-5 py-12 sm:px-8 lg:px-12 sm:py-16">
        {filteredProducts.length === 0 ? (
          <div className="py-24 text-center">
            <Sparkles className="mx-auto h-8 w-8 text-[#9d753d]" strokeWidth={1.25} />
            <h2 className="mt-4 text-2xl font-light tracking-tight">Không tìm thấy công thức phù hợp</h2>
            <p className="mt-2 text-sm text-[#77736b]">Hãy thử gỡ bỏ một vài bộ lọc hoặc xem tất cả vật phẩm.</p>
            <button
              type="button"
              onClick={handleClearFilters}
              className="mt-6 border border-[#282723] px-6 py-2.5 text-xs font-medium uppercase tracking-[0.14em] transition-colors hover:bg-[#282723] hover:text-white"
            >
              Xem tất cả vật phẩm
            </button>
          </div>
        ) : (
          <div
            className={`grid grid-cols-1 gap-6 sm:grid-cols-2 ${
              gridCols === 2 ? "lg:grid-cols-2 lg:gap-10" : gridCols === 3 ? "lg:grid-cols-3 lg:gap-8" : "lg:grid-cols-4 lg:gap-6"
            }`}
          >
            {filteredProducts.map((product, index) => {
              // Interstitial Editorial Tile 1 (insertMode after slot 2)
              const showEditorial1 = insertMode && index === 2;
              // Interstitial Editorial Tile 2 (insertMode after slot 5)
              const showEditorial2 = insertMode && index === 5;

              return (
                <div key={product.id} className="contents">
                  {/* PRODUCT CARD */}
                  <article className="group flex flex-col border border-[#282723]/10 bg-[#faf8f5] transition-shadow duration-300 hover:shadow-[0_12px_32px_rgba(36,35,31,0.06)]">
                    {/* Image Box */}
                    <div className="relative aspect-[1/1.08] overflow-hidden bg-[#e8e4da]/50 p-6">
                      <Link
                        href={`/san-pham/${product.id}`}
                        className="relative block h-full w-full focus-visible:outline-none"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                        />
                      </Link>

                      {/* Quick view button overlay */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          openProductModal(product.id);
                        }}
                        aria-label={`Xem nhanh ${product.name}`}
                        title="Xem nhanh"
                        className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center border border-[#282723]/20 bg-white/90 text-[#282723] opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-[#282723] hover:text-white"
                      >
                        <Eye className="h-4 w-4" strokeWidth={1.25} />
                      </button>

                      {/* Badge if available */}
                      {product.badge && (
                        <span className="absolute left-4 top-4 border border-[#282723]/15 bg-[#faf8f5]/90 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-[#625f57]">
                          {product.badge}
                        </span>
                      )}
                    </div>

                    {/* Content Box */}
                    <div className="flex flex-1 flex-col p-5 sm:p-6 items-center text-center sm:items-start sm:text-left">
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9d753d]">
                        {product.categoryName}
                      </div>

                      <h3 className="mt-2 text-lg sm:text-xl font-semibold leading-snug tracking-[-0.02em] text-[#24231f]">
                        <Link
                          href={`/san-pham/${product.id}`}
                          className="transition-colors hover:text-[#9d753d]"
                        >
                          {product.name}
                        </Link>
                      </h3>

                      {/* Origin & Format line */}
                      <p className="mt-1 text-sm text-[#77736b]">
                        {product.origin}
                      </p>

                      {/* Aromatic Profile */}
                      <div className="mt-3 w-full border-t border-[#282723]/10 pt-3 text-sm leading-relaxed text-[#504c44]">
                        <span className="text-[#24231f] font-semibold">Nốt hương: </span>
                        {product.notes}
                      </div>

                      {/* Price & Add to Cart (Aesop Minimalist Bar) */}
                      <div className="mt-auto pt-6 w-full">
                        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-[#282723]/15 pt-4 gap-3 sm:gap-0">
                          <div className="flex items-baseline gap-2">
                            <span className="text-base sm:text-lg font-bold text-[#24231f] tracking-tight">
                              {product.price.toLocaleString("vi-VN")}đ
                            </span>
                            {product.originalPrice && product.originalPrice > product.price && (
                              <span className="text-xs sm:text-sm text-[#77736b] line-through">
                                {product.originalPrice.toLocaleString("vi-VN")}đ
                              </span>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => handleAddToCart(product)}
                            className="inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm font-semibold uppercase tracking-[0.12em] text-[#24231f] transition-colors hover:text-[#9d753d] cursor-pointer w-full sm:w-auto py-2 sm:py-0 border border-[#282723]/20 sm:border-0"
                          >
                            {addedId === product.id ? (
                              <>
                                <Check className="h-4 w-4 text-[#66705a]" />
                                <span className="text-[#66705a]">Đã thêm</span>
                              </>
                            ) : (
                              <>
                                <ShoppingBag className="h-4 w-4" strokeWidth={1.25} />
                                <span>Thêm vào giỏ</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>

                  {/* EDITORIAL CARD 1 (insertMode: Nghi thức thanh tẩy) */}
                  {showEditorial1 && (
                    <article className="col-span-1 flex flex-col overflow-hidden border border-[#282723]/15 bg-[#e8e4da] sm:col-span-2 lg:col-span-2 md:flex-row">
                      <div className="relative min-h-[260px] md:w-1/2">
                        <Image
                          src="/videos/palo-santo-poster.jpg"
                          alt="Khói thơm từ gỗ Palo Santo"
                          fill
                          sizes="(min-width: 1024px) 33vw, 100vw"
                          className="object-cover object-center"
                        />
                      </div>
                      <div className="flex flex-1 flex-col justify-between p-6 sm:p-8 md:w-1/2 items-center text-center sm:items-start sm:text-left">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9d753d]">
                            Nghi thức thường nhật
                          </p>
                          <h4 className="mt-3 text-2xl font-normal leading-tight tracking-[-0.03em] sm:text-3xl text-[#24231f]">
                            Một khoảng lặng vừa đủ trong ngày
                          </h4>
                          <p className="mt-4 text-sm sm:text-base leading-relaxed text-[#4e4a42]">
                            Hương thơm không phải là thứ để che lấp, mà là cách chúng ta thiết lập lại không gian và tìm về với sự tĩnh tại bên trong.
                          </p>
                        </div>
                        <div className="mt-6 pt-4 border-t border-[#282723]/15 w-full flex justify-center sm:justify-start">
                          <Link
                            href="/story/tay-tang-huyen-bi"
                            className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-[#24231f] transition-colors hover:text-[#9d753d]"
                          >
                            <span>Khám phá câu chuyện Tây Tạng</span>
                            <ArrowRight className="h-4 w-4" strokeWidth={1.25} />
                          </Link>
                        </div>
                      </div>
                    </article>
                  )}

                  {/* EDITORIAL CARD 2 (insertMode: Tư vấn chọn vật phẩm) */}
                  {showEditorial2 && (
                    <article className="col-span-1 flex flex-col justify-between overflow-hidden border border-[#282723]/15 bg-[#ded8cb] p-6 sm:col-span-2 sm:p-10 lg:col-span-2 items-center text-center sm:items-start sm:text-left">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9d753d]">
                          Dịch vụ đồng hành
                        </p>
                        <h4 className="mt-3 text-2xl font-normal leading-tight tracking-[-0.03em] sm:text-3xl text-[#24231f]">
                          Tư vấn nốt hương riêng cho không gian sống
                        </h4>
                        <p className="mt-4 max-w-xl text-sm sm:text-base leading-relaxed text-[#4e4a42]">
                          Mỗi góc nhỏ có một nhịp thở riêng. Đội ngũ RUNGU sẵn sàng lắng nghe nhu cầu của bạn để gợi ý sự kết hợp hài hòa nhất giữa Palo Santo, nến sáp và nhang trầm cho phòng khách, phòng ngủ hoặc bàn trà.
                        </p>
                      </div>

                      <div className="mt-8 flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-6 border-t border-[#282723]/15 pt-6 text-sm w-full">
                        <a
                          href="#contact"
                          className="inline-flex items-center gap-2 border border-[#282723] px-5 py-2.5 uppercase tracking-[0.12em] font-medium transition-colors hover:bg-[#282723] hover:text-white"
                        >
                          <span>Gửi tin nhắn tư vấn</span>
                          <ArrowUpRight className="h-4 w-4" strokeWidth={1.25} />
                        </a>
                        <span className="text-[#504c44] font-medium">Hotline: 0868 238 690</span>
                      </div>
                    </article>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* 4. PROGRESS BAR & BOTTOM CONSULTATION (Aesop PLP Footer) */}
        <div className="mt-20 border-t border-[#282723]/15 pt-12 text-center">
          <p className="text-xs sm:text-sm uppercase tracking-[0.16em] text-[#77736b]">
            Đang hiển thị {filteredProducts.length} trên {products.length} công thức
          </p>

          <div className="mx-auto mt-4 h-0.5 w-48 bg-[#282723]/15 overflow-hidden">
            <div
              className="h-full bg-[#9d753d] transition-all duration-500"
              style={{ width: `${(filteredProducts.length / (products.length || 1)) * 100}%` }}
            />
          </div>

          <div className="mx-auto mt-16 max-w-2xl border border-[#282723]/15 bg-[#faf8f5] p-8 text-center">
            <h4 className="text-2xl font-normal tracking-tight text-[#24231f]">
              Cần sự hỗ trợ để chọn lựa món quà hoặc công thức phù hợp?
            </h4>
            <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#504c44]">
              Chúng tôi hân hạnh đồng hành cùng bạn qua tư vấn trực tiếp, hỗ trợ gói quà mộc kèm thiệp viết tay theo yêu cầu.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <a
                href="#contact"
                className="border border-[#282723] px-6 py-3 text-xs sm:text-sm font-semibold uppercase tracking-[0.16em] transition-colors hover:bg-[#282723] hover:text-white cursor-pointer"
              >
                Liên hệ chúng tôi
              </a>
              <Link
                href="/story/tay-tang-huyen-bi"
                className="border border-[#282723]/30 px-6 py-3 text-xs sm:text-sm font-semibold uppercase tracking-[0.16em] text-[#504c44] transition-colors hover:border-[#282723] hover:text-[#282723]"
              >
                Đọc thư viện câu chuyện
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SLIDE-OVER FILTER DRAWER (All Filters Panel) */}
      <AnimatePresence>
        {isFilterDrawerOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setIsFilterDrawerOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-xs"
            />

            {/* Drawer Sheet */}
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex h-full w-full max-w-md flex-col bg-[#f7f5f0] text-[#282723] shadow-2xl"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-[#282723]/15 p-6">
                <div>
                  <h3 className="text-xl font-light tracking-[-0.02em]">Bộ lọc công thức</h3>
                  <p className="mt-0.5 text-xs text-[#77736b]">
                    {activeFiltersCount > 0 ? `${activeFiltersCount} tiêu chí đã chọn` : "Lựa chọn theo nhu cầu của bạn"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsFilterDrawerOpen(false)}
                  aria-label="Đóng bộ lọc"
                  className="p-2 transition-opacity hover:opacity-70"
                >
                  <X className="h-5 w-5" strokeWidth={1.25} />
                </button>
              </div>

              {/* Drawer Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* 1. Danh mục */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9d753d]">
                    Danh mục sản phẩm
                  </h4>
                  <div className="mt-4 space-y-2">
                    {categoryFilters.map((cat) => (
                      <label
                        key={cat.id}
                        className="flex cursor-pointer items-center justify-between py-1.5 text-xs text-[#282723] hover:text-[#9d753d]"
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="category-filter"
                            checked={selectedCategory === cat.id}
                            onChange={() => setSelectedCategory(cat.id)}
                            className="h-4 w-4 accent-[#9d753d]"
                          />
                          <span>{cat.label}</span>
                        </div>
                        <span className="text-[11px] text-[#77736b]">({cat.count})</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 2. Nốt hương & Đặc tính */}
                <div className="border-t border-[#282723]/10 pt-6">
                  <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9d753d]">
                    Nốt hương & Cảm giác
                  </h4>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {SCENT_OPTIONS.map((scent) => {
                      const isSelected = selectedScents.includes(scent.id);
                      return (
                        <button
                          key={scent.id}
                          type="button"
                          onClick={() => toggleScent(scent.id)}
                          className={`border px-3 py-1.5 text-xs transition-colors ${
                            isSelected
                              ? "border-[#282723] bg-[#282723] text-white font-medium"
                              : "border-[#282723]/25 bg-white/50 text-[#625f57] hover:border-[#282723]"
                          }`}
                        >
                          {scent.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Khoảng giá */}
                <div className="border-t border-[#282723]/10 pt-6">
                  <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9d753d]">
                    Khoảng giá
                  </h4>
                  <div className="mt-4 space-y-2">
                    {PRICE_RANGES.map((price) => (
                      <label
                        key={price.id}
                        className="flex cursor-pointer items-center gap-3 py-1.5 text-xs text-[#282723] hover:text-[#9d753d]"
                      >
                        <input
                          type="radio"
                          name="price-filter"
                          checked={selectedPriceRange === price.id}
                          onChange={() => setSelectedPriceRange(price.id)}
                          className="h-4 w-4 accent-[#9d753d]"
                        />
                        <span>{price.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 4. Bộ sưu tập / Nhãn */}
                <div className="border-t border-[#282723]/10 pt-6">
                  <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9d753d]">
                    Bộ sưu tập
                  </h4>
                  <div className="mt-4 space-y-2">
                    {[
                      { id: "all", label: "Tất cả vật phẩm" },
                      { id: "new", label: "Mới & đáng chú ý" },
                      { id: "bestseller", label: "Được yêu thích nhất" },
                      { id: "sale", label: "Khuyến mại đặc biệt" },
                    ].map((badge) => (
                      <label
                        key={badge.id}
                        className="flex cursor-pointer items-center gap-3 py-1.5 text-xs text-[#282723] hover:text-[#9d753d]"
                      >
                        <input
                          type="radio"
                          name="badge-filter"
                          checked={selectedBadge === badge.id}
                          onChange={() => setSelectedBadge(badge.id)}
                          className="h-4 w-4 accent-[#9d753d]"
                        />
                        <span>{badge.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Drawer Footer Actions */}
              <div className="border-t border-[#282723]/15 bg-[#f0ede4] p-6 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="text-xs font-medium text-[#77736b] underline underline-offset-4 hover:text-[#282723]"
                >
                  Xóa tất cả bộ lọc
                </button>

                <button
                  type="button"
                  onClick={() => setIsFilterDrawerOpen(false)}
                  className="border border-[#282723] bg-[#282723] px-6 py-3 text-xs font-medium uppercase tracking-[0.16em] text-white transition-colors hover:bg-black"
                >
                  Hiển thị ({filteredProducts.length})
                </button>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
