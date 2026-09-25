"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ChevronDown, ArrowRight, ArrowUpRight, Menu, Search, ShoppingBag, X } from "lucide-react";
import { PRIMARY_CATEGORY_SLUGS, useCart } from "@/lib/CartContext";
import { countProductsInCategory } from "@/lib/categoryFilters";
import type { StorefrontCategory } from "@/lib/catalog";
import NavigationModal from "./NavigationModal";
import CartDrawer from "./CartDrawer";
import ProductModal from "./ProductModal";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const isLightPage = Boolean(pathname?.startsWith("/san-pham/"));

  const { cartCount, isCartOpen, setCartOpen, products, categories, setSelectedCategory, storefrontContent } = useCart();
  const [isNavOpen, setNavOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isProductsHovered, setIsProductsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollY = useRef(0);

  const dropdownCloseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const announcement = storefrontContent.announcement[0]
    || (Object.values(storefrontContent.sales).some((method) => method.enabled && method.free_shipping)
      ? "Miễn phí giao hàng cho đơn hàng RUNGU"
      : "Giao hàng toàn quốc");

  // Smart sticky header: hide on scroll down, show on scroll up
  useEffect(() => {
    let rafId: number | null = null;
    lastScrollY.current = Math.max(0, window.scrollY);

    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = null;

        const currentScrollY = Math.max(0, window.scrollY);

        // Keep header visible whenever an interactive overlay or modal is active
        if (isNavOpen || isSearchOpen || isCartOpen || isProductsHovered) {
          setIsVisible(true);
          lastScrollY.current = currentScrollY;
          return;
        }

        // At top of page: always visible, restore hero transparent state
        if (currentScrollY <= 40) {
          setIsVisible(true);
          setIsScrolled(false);
          lastScrollY.current = currentScrollY;
          return;
        }

        setIsScrolled(true);

        const diff = currentScrollY - lastScrollY.current;

        // Ignore micro-scroll jitter (< 8px)
        if (Math.abs(diff) < 8) return;

        if (diff > 0 && currentScrollY > 80) {
          // Scrolling DOWN -> hide navbar
          setIsVisible(false);
        } else if (diff < 0) {
          // Scrolling UP -> reveal navbar
          setIsVisible(true);
        }

        lastScrollY.current = currentScrollY;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isNavOpen, isSearchOpen, isCartOpen, isProductsHovered]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isSearchOpen) {
        setSearchOpen(false);
      }
    };
    if (isSearchOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSearchOpen]);

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const q = searchTerm.toLowerCase().trim();
    return products.filter((p) =>
      p.name.toLowerCase().includes(q) ||
      p.categoryName.toLowerCase().includes(q) ||
      p.notes.toLowerCase().includes(q) ||
      p.desc.toLowerCase().includes(q)
    ).slice(0, 5);
  }, [searchTerm, products]);

  const dropdownCategories = useMemo(() => [
    { id: "all", label: "Tất cả sản phẩm", count: products.length, sub: "Trọn bộ vật phẩm mộc & hương thơm tự nhiên", isChild: false },
    ...categories.map((category) => ({
      id: category.slug,
      label: category.name,
      count: countProductsInCategory(products, categories, category.slug),
      sub: category.description || "",
      isChild: category.parent_id !== null,
    })),
  ], [products, categories]);

  const primaryCategories = useMemo(() =>
    PRIMARY_CATEGORY_SLUGS
      .map((slug) => categories.find((category) => category.slug === slug))
      .filter((category): category is StorefrontCategory => Boolean(category)),
  [categories]);

  const handleDropdownEnter = () => {
    if (dropdownCloseTimeoutRef.current) {
      clearTimeout(dropdownCloseTimeoutRef.current);
      dropdownCloseTimeoutRef.current = null;
    }
    setIsProductsHovered(true);
  };

  const handleDropdownLeave = () => {
    dropdownCloseTimeoutRef.current = setTimeout(() => {
      setIsProductsHovered(false);
    }, 180);
  };

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    setIsProductsHovered(false);
    const el = document.getElementById(targetId);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/san-pham?q=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.push("/san-pham");
    }
    setSearchOpen(false);
  };

  return (
    <>
      <motion.header
        initial={{ y: 0 }}
        animate={{ y: isVisible ? 0 : "-100%" }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        className="fixed inset-x-0 top-0 z-40 text-white will-change-transform"
      >
        <div className="flex min-h-9 items-center justify-center bg-[#2d2d2b] px-4 text-center text-xs tracking-[0.03em] font-medium">
          {announcement}
        </div>

        <div className={`site-header-main ${isScrolled || isLightPage ? "is-scrolled" : ""}`}>
          <div className="mx-auto max-w-[1540px] px-5 sm:px-8 lg:px-12">
            <div className="relative flex min-h-[64px] sm:min-h-[76px] items-center justify-center">
              {/* Mobile Left: Menu Toggle Button */}
              <div className="absolute left-0 flex items-center lg:hidden">
                <button
                  type="button"
                  onClick={() => setNavOpen(true)}
                  aria-label="Mở menu điều hướng"
                  className="header-icon flex items-center gap-1.5 p-1 transition-opacity hover:opacity-70"
                >
                  <Menu className="h-5 w-5" strokeWidth={1.35} />
                  <span className="hidden sm:inline text-xs font-semibold uppercase tracking-[0.16em]">Menu</span>
                </button>
              </div>

              {/* Centered Brand Logo */}
              <Link href="/" aria-label="RUNGU, trang chủ" className="flex items-center transition-opacity hover:opacity-70 mx-auto">
                <Image src="/rungu-logo.png" alt="RUNGU" width={2172} height={724} priority className="header-logo h-auto w-[150px] sm:w-[190px]" />
              </Link>

              {/* Mobile Right: Search & Cart Buttons */}
              <div className="absolute right-0 flex items-center gap-3.5 sm:gap-4 lg:hidden">
                <button
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  aria-label="Tìm kiếm sản phẩm"
                  className="header-icon p-1 transition-opacity hover:opacity-70"
                >
                  <Search className="h-5 w-5" strokeWidth={1.35} />
                </button>
                <button
                  type="button"
                  onClick={() => setCartOpen(true)}
                  aria-label={`Giỏ hàng (${cartCount})`}
                  className="header-icon relative flex items-center p-1 transition-opacity hover:opacity-70"
                >
                  <ShoppingBag className="h-5 w-5" strokeWidth={1.35} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#9d753d] px-1 text-[10px] font-bold leading-none text-white">
                      {cartCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            <div className="relative hidden min-h-[58px] items-center justify-between lg:flex">
              {/* Bên trái: Trả lại Tìm kiếm về chỗ cũ */}
              <div className="flex-1 flex items-center justify-start">
                <button
                  type="button"
                  onClick={() => setSearchOpen((open) => !open)}
                  className="header-link flex items-center gap-2 text-sm font-medium leading-none transition-opacity hover:opacity-70 cursor-pointer"
                  aria-expanded={isSearchOpen}
                >
                  <Search className="h-4 w-4" strokeWidth={1.4} />
                  <span>Tìm kiếm</span>
                </button>
              </div>

              <nav aria-label="Điều hướng chính" className="flex items-center gap-1.5 lg:gap-2.5 xl:gap-4 2xl:gap-6 shrink-0">
                {/* 1. Sản phẩm (kèm dropdown hover danh mục) */}
                <div
                  className="relative flex items-center"
                  onMouseEnter={handleDropdownEnter}
                  onMouseLeave={handleDropdownLeave}
                >
                  <Link
                    href="/san-pham"
                    className="header-nav-link group flex h-full items-center gap-1 whitespace-nowrap px-1.5 xl:px-2.5 py-5 font-medium leading-none focus-visible:outline-none"
                    aria-expanded={isProductsHovered}
                  >
                    <span>Sản phẩm</span>
                    <ChevronDown
                      className={`h-3 w-3 transition-transform duration-200 ${isProductsHovered ? "rotate-180 text-[#9d753d]" : ""}`}
                      strokeWidth={1.5}
                    />
                  </Link>

                  <AnimatePresence>
                    {isProductsHovered && (
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.98 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                        className="absolute left-1/2 top-full -translate-x-1/2 pt-1.5 z-50 w-[340px] before:absolute before:-top-3 before:left-0 before:right-0 before:h-3"
                      >
                        <div className="border border-[#282723]/15 bg-[#f7f5f0] p-3 text-[#24231f] shadow-[0_22px_45px_rgba(24,24,20,0.16)]">
                          <div className="mb-2 flex items-center justify-between border-b border-[#282723]/10 px-2 pb-2">
                            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#77736b]">Danh mục sản phẩm</span>
                            <span className="font-mono text-[10px] text-[#9d753d]">{categories.length} danh mục</span>
                          </div>

                          <div className="space-y-1">
                            {dropdownCategories.map((cat) => (
                              <Link
                                key={cat.id}
                                href={cat.id === "all" ? "/san-pham" : `/san-pham?category=${cat.id}`}
                                onClick={() => {
                                  setSelectedCategory(cat.id);
                                  setIsProductsHovered(false);
                                }}
                                className={`group flex w-full items-center justify-between py-2.5 pr-3 text-left transition-colors hover:bg-[#ede8dd] ${cat.isChild ? "pl-6" : "pl-3"}`}
                              >
                                <div className="min-w-0 pr-3">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[13px] font-medium tracking-[-0.01em] transition-colors group-hover:text-[#9d753d]">
                                      {cat.label}
                                    </span>
                                    <span className="text-[11px] text-[#77736b]">({cat.count})</span>
                                  </div>
                                  {cat.sub && (
                                    <p className="mt-0.5 truncate text-[11px] leading-tight text-[#77736b]">
                                      {cat.sub}
                                    </p>
                                  )}
                                </div>
                                <ArrowRight className="h-3.5 w-3.5 shrink-0 text-[#77736b] opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100 group-hover:text-[#9d753d]" strokeWidth={1.5} />
                              </Link>
                            ))}
                          </div>

                          <div className="mt-2.5 border-t border-[#282723]/10 px-2 pt-2.5">
                            <Link
                              href="/san-pham"
                              onClick={() => setIsProductsHovered(false)}
                              className="flex w-full items-center justify-between text-[11px] font-medium text-[#77736b] transition-colors hover:text-[#9d753d]"
                            >
                              <span>Xem tất cả công thức tại /san-pham</span>
                              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {primaryCategories.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/san-pham?category=${encodeURIComponent(category.slug)}`}
                    onClick={() => setSelectedCategory(category.slug)}
                    className="header-nav-link flex h-full items-center whitespace-nowrap px-1.5 xl:px-2.5 py-5 font-medium leading-none"
                  >
                    {category.name}
                  </Link>
                ))}

                {/* 8. Thư viện */}
                <Link
                  href="/#stories"
                  onClick={(e) => handleAnchorClick(e, "stories")}
                  className="header-nav-link flex h-full items-center whitespace-nowrap px-1.5 xl:px-2.5 py-5 font-medium leading-none"
                >
                  Thư viện
                </Link>

                {/* 9. Liên hệ */}
                <Link
                  href="/#contact"
                  onClick={(e) => handleAnchorClick(e, "contact")}
                  className="header-nav-link flex h-full items-center whitespace-nowrap px-1.5 xl:px-2.5 py-5 font-medium leading-none"
                >
                  Liên hệ
                </Link>
              </nav>

              {/* Bên phải: Giỏ hàng thẳng hàng với điều hướng */}
              <div className="flex-1 flex items-center justify-end text-sm font-medium">
                <button
                  type="button"
                  onClick={() => setCartOpen(true)}
                  aria-label={`Giỏ hàng (${cartCount})`}
                  className="header-link flex items-center gap-2 text-sm font-medium leading-none transition-opacity hover:opacity-70 cursor-pointer"
                >
                  <ShoppingBag className="h-4 w-4" strokeWidth={1.4} />
                  <span>Giỏ hàng ({cartCount})</span>
                </button>
              </div>
            </div>
          </div>
        </div>

      </motion.header>

      {/* Luxury Fullscreen Search Overlay Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24 }}
            className="fixed inset-0 z-50 flex flex-col bg-[#fbf9f5]/98 backdrop-blur-2xl text-[#24231f] overflow-y-auto"
          >
            {/* Top Bar inside Search Modal */}
            <div className="border-b border-[#24231f]/10 px-6 py-5 sm:px-10 lg:px-14 bg-white/40">
              <div className="mx-auto flex max-w-[1300px] items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9d753d]">
                    Tìm kiếm sản phẩm
                  </span>
                  <span className="hidden sm:inline text-xs text-[#77736b]">• RUNGU Fragrance & Rituals</span>
                </div>

                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="group flex items-center gap-2 rounded-full border border-[#24231f]/15 bg-white/70 px-4 py-2 text-xs font-medium text-[#24231f] transition-all hover:bg-[#24231f] hover:text-white cursor-pointer shadow-xs"
                >
                  <span>Đóng</span>
                  <span className="hidden font-mono text-[10px] opacity-60 group-hover:opacity-80 sm:inline">(ESC)</span>
                  <X className="h-4 w-4" strokeWidth={1.5} />
                </button>
              </div>
            </div>

            {/* Search Content Container */}
            <div className="mx-auto w-full max-w-[960px] flex-1 px-6 py-10 sm:px-10 sm:py-14">
              {/* Large Luxury Search Input */}
              <form onSubmit={handleSearch} className="relative">
                <div className="relative flex items-center border-b-2 border-[#24231f]/20 pb-4 transition-colors focus-within:border-[#9d753d]">
                  <Search className="h-6 w-6 sm:h-8 sm:w-8 text-[#9d753d] shrink-0 mr-4" strokeWidth={1.4} />
                  <input
                    id="site-search"
                    autoFocus
                    type="search"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Tìm kiếm theo tên sản phẩm, loại gỗ, tầng hương..."
                    className="w-full bg-transparent text-xl sm:text-3xl font-light text-[#24231f] placeholder:text-[#24231f]/35 focus:outline-none tracking-tight"
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm("")}
                      className="p-2 text-[#77736b] hover:text-[#24231f] cursor-pointer"
                      aria-label="Xóa nội dung"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                  <button
                    type="submit"
                    className="ml-3 hidden sm:inline-flex items-center gap-1.5 rounded-full bg-[#24231f] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition-all hover:bg-[#9d753d] shadow-sm cursor-pointer"
                  >
                    <span>Tìm kiếm</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </form>

              {/* Suggestions when input is empty */}
              {!searchTerm.trim() && (
                <div className="mt-10">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#77736b]">
                    Từ khóa tìm kiếm phổ biến
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2.5">
                    {[
                      "Gỗ Trắc đỏ",
                      "Palo Santo",
                      "Xô thơm trắng",
                      "Nến thơm thảo mộc",
                      "Khay xông trầm",
                      "Trầm hương tự nhiên",
                      "Chuông thiền 432Hz",
                    ].map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setSearchTerm(tag)}
                        className="rounded-full border border-[#24231f]/15 bg-white/70 px-4 py-2 text-xs text-[#24231f] transition-all hover:border-[#9d753d] hover:bg-[#9d753d] hover:text-white cursor-pointer shadow-xs"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>

                  {/* Featured Categories */}
                  <div className="mt-12 border-t border-[#24231f]/10 pt-8">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#77736b]">
                      Khám phá danh mục nổi bật
                    </p>
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {dropdownCategories
                        .filter((c) => c.id !== "all")
                        .slice(0, 4)
                        .map((cat) => (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => {
                              setSelectedCategory(cat.id);
                              setSearchOpen(false);
                              router.push(`/san-pham?category=${cat.id}`);
                            }}
                            className="group flex flex-col items-start rounded-xl border border-[#24231f]/10 bg-white/70 p-4 text-left transition-all hover:border-[#9d753d] hover:bg-white hover:shadow-sm cursor-pointer"
                          >
                            <span className="text-xs font-medium text-[#24231f] group-hover:text-[#9d753d] transition-colors">
                              {cat.label}
                            </span>
                            <span className="mt-1 text-[11px] text-[#77736b]">{cat.count} sản phẩm</span>
                          </button>
                        ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Real-time search results */}
              {searchTerm.trim().length > 0 && (
                <div className="mt-10">
                  <div className="flex items-center justify-between pb-4 border-b border-[#24231f]/10">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#77736b]">
                      {searchResults.length > 0
                        ? `Tìm thấy ${searchResults.length} sản phẩm phù hợp`
                        : "Không tìm thấy sản phẩm phù hợp"}
                    </p>
                    {searchResults.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          router.push(`/san-pham?q=${encodeURIComponent(searchTerm.trim())}`);
                          setSearchOpen(false);
                        }}
                        className="text-xs font-semibold text-[#9d753d] hover:text-[#24231f] flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <span>Xem tất cả kết quả</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  {searchResults.length > 0 ? (
                    <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                      {searchResults.map((item) => (
                        <Link
                          key={item.id}
                          href={`/san-pham/${item.id}`}
                          onClick={() => setSearchOpen(false)}
                          className="group flex flex-col rounded-xl border border-[#24231f]/10 bg-white p-3 transition-all hover:border-[#9d753d] hover:shadow-md cursor-pointer"
                        >
                          <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-[#ece7dd]">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                          <span className="mt-2.5 text-[10px] font-semibold uppercase tracking-wider text-[#9d753d]">
                            {item.categoryName}
                          </span>
                          <h4 className="mt-1 line-clamp-2 text-xs font-medium text-[#24231f] group-hover:text-[#9d753d] leading-snug">
                            {item.name}
                          </h4>
                          <span className="mt-2 text-xs font-semibold text-[#8d693a]">
                            {item.price.toLocaleString("vi-VN")} đ
                          </span>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="py-14 text-center">
                      <p className="text-base text-[#24231f]">
                        Không tìm thấy sản phẩm nào khớp với &ldquo;<span className="font-medium text-[#9d753d]">{searchTerm}</span>&rdquo;
                      </p>
                      <p className="mt-2 text-xs text-[#77736b]">
                        Thử tìm kiếm với từ khóa khác như: Palo Santo, Xô thơm, Trầm hương, Gỗ trắc...
                      </p>
                      <div className="mt-6 flex justify-center gap-2">
                        {["Palo Santo", "Trầm hương", "Xô thơm"].map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => setSearchTerm(tag)}
                            className="rounded-full border border-[#24231f]/15 bg-white px-3.5 py-1.5 text-xs text-[#24231f] hover:border-[#9d753d] hover:text-[#9d753d] cursor-pointer"
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <NavigationModal isOpen={isNavOpen} onClose={() => setNavOpen(false)} />
      <CartDrawer />
      <ProductModal />
    </>
  );
}
