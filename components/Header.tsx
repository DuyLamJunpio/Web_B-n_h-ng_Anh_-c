"use client";

import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ArrowRight, ArrowUpRight, Menu, Search, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/lib/CartContext";
import NavigationModal from "./NavigationModal";
import CartDrawer from "./CartDrawer";
import ProductModal from "./ProductModal";

export default function Header() {
  const { cartCount, setCartOpen, products, setSelectedCategory } = useCart();
  const [isNavOpen, setNavOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isProductsHovered, setIsProductsHovered] = useState(false);
  const dropdownCloseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const categories = useMemo(() => {
    const map = new Map<string, { id: string; label: string; count: number; sub: string }>();
    map.set("all", {
      id: "all",
      label: "Tất cả sản phẩm",
      count: products.length,
      sub: "Trọn bộ vật phẩm mộc & hương thơm tự nhiên",
    });

    products.forEach((p) => {
      if (!map.has(p.category)) {
        map.set(p.category, {
          id: p.category,
          label: p.categoryName || p.category,
          count: 1,
          sub: p.notes || p.desc || "",
        });
      } else {
        const item = map.get(p.category)!;
        item.count += 1;
      }
    });

    return Array.from(map.values());
  }, [products]);

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

  const navigateTo = (targetId: string, category?: string) => {
    if (category) {
      setSelectedCategory(category);
    }
    setIsProductsHovered(false);
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = `/#${targetId}`;
    }
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigateTo("collections");
    setSearchOpen(false);
  };

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="absolute inset-x-0 top-0 z-40 text-white"
      >
        <div className="flex min-h-9 items-center justify-center bg-[#2d2d2b] px-4 text-center text-[11px] tracking-[0.02em]">
          Miễn phí giao hàng cho đơn từ 1.000.000đ
        </div>

        <div className="site-header-main">
          <div className="mx-auto max-w-[1540px] px-5 sm:px-8 lg:px-12">
            <div className="relative flex min-h-[72px] items-center justify-between">
              <div className="hidden items-center gap-7 text-xs font-medium lg:flex">
                <Link href="/san-pham" className="header-link">Cửa hàng</Link>
                <Link href="/#contact" className="header-link">Chăm sóc khách hàng</Link>
              </div>

              <Link href="/" aria-label="RUNGU, trang chủ" className="absolute left-1/2 flex -translate-x-1/2 items-center transition-opacity hover:opacity-70">
                <Image src="/rungu-logo.png" alt="RUNGU" width={2172} height={724} priority className="header-logo h-auto w-[165px] sm:w-[190px]" />
              </Link>

              <div className="ml-auto flex items-center gap-4 text-xs font-medium sm:gap-6">
                <Link href="/#contact" className="header-link hidden sm:inline">Đăng ký email</Link>
                <button type="button" onClick={() => setNavOpen(true)} className="header-link hidden sm:inline">Tài khoản</button>
                <button type="button" onClick={() => setCartOpen(true)} className="header-link">Giỏ hàng ({cartCount})</button>
                <button type="button" onClick={() => setNavOpen(true)} aria-label="Mở menu" className="header-icon lg:hidden">
                  <Menu className="h-5 w-5" strokeWidth={1.35} />
                </button>
              </div>
            </div>

            <div className="relative hidden min-h-[58px] items-center lg:flex">
              <nav aria-label="Điều hướng chính" className="absolute left-1/2 flex -translate-x-1/2 items-center gap-3 xl:gap-7">
                {/* 1. Sản phẩm (kèm dropdown hover danh mục) */}
                <div
                  className="relative flex items-center"
                  onMouseEnter={handleDropdownEnter}
                  onMouseLeave={handleDropdownLeave}
                >
                  <Link
                    href="/san-pham"
                    className="header-nav-link group flex h-full items-center gap-1.5 whitespace-nowrap px-2 py-5 text-[13px] font-medium leading-none focus-visible:outline-none"
                    aria-expanded={isProductsHovered}
                  >
                    <span>Sản phẩm</span>
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform duration-200 ${isProductsHovered ? "rotate-180 text-[#9d753d]" : ""}`}
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
                            <span className="font-mono text-[10px] text-[#9d753d]">{categories.length - 1} danh mục</span>
                          </div>

                          <div className="space-y-1">
                            {categories.map((cat) => (
                              <Link
                                key={cat.id}
                                href={cat.id === "all" ? "/san-pham" : `/san-pham?category=${cat.id}`}
                                onClick={() => {
                                  setSelectedCategory(cat.id);
                                  setIsProductsHovered(false);
                                }}
                                className="group flex w-full items-center justify-between px-3 py-2.5 text-left transition-colors hover:bg-[#ede8dd]"
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

                {/* 2. Mới đáng chú ý */}
                <Link
                  href="/san-pham?collection=new"
                  className="header-nav-link flex h-full items-center whitespace-nowrap px-2 py-5 text-[13px] font-medium leading-none"
                >
                  Mới đáng chú ý
                </Link>

                {/* 3. Khuyến mại */}
                <Link
                  href="/san-pham?collection=sale"
                  className="header-nav-link flex h-full items-center whitespace-nowrap px-2 py-5 text-[13px] font-medium leading-none"
                >
                  Khuyến mại
                </Link>

                {/* 4. Câu chuyện */}
                <Link
                  href="/#stories"
                  className="header-nav-link flex h-full items-center whitespace-nowrap px-2 py-5 text-[13px] font-medium leading-none"
                >
                  Câu chuyện
                </Link>

                {/* 5. Liên hệ */}
                <Link
                  href="/#contact"
                  className="header-nav-link flex h-full items-center whitespace-nowrap px-2 py-5 text-[13px] font-medium leading-none"
                >
                  Liên hệ
                </Link>
              </nav>
              <button type="button" onClick={() => setSearchOpen((open) => !open)} className="header-link flex h-10 w-[150px] items-center justify-end gap-2 pl-5 text-xs font-medium leading-none transition-opacity hover:opacity-70" aria-expanded={isSearchOpen}>
                <Search className="h-5 w-5" strokeWidth={1.25} />
                <span>Tìm kiếm</span>
              </button>
            </div>

            <div className="flex min-h-12 items-center justify-between lg:hidden">
              <button type="button" onClick={() => setNavOpen(true)} className="text-[10px] font-semibold uppercase tracking-[0.16em] transition-opacity hover:opacity-70">Menu</button>
              <button type="button" onClick={() => setSearchOpen((open) => !open)} aria-label="Tìm kiếm" className="header-icon">
                <Search className="h-4 w-4" strokeWidth={1.25} />
              </button>
              <button type="button" onClick={() => setCartOpen(true)} aria-label={`Giỏ hàng (${cartCount})`} className="flex items-center gap-2 text-[10px] uppercase tracking-[0.12em] transition-opacity hover:opacity-70">
                <ShoppingBag className="h-4 w-4" strokeWidth={1.25} />({cartCount})
              </button>
            </div>
          </div>
        </div>

        {isSearchOpen && (
          <div className="bg-[#f3f1eb] text-[#252523] shadow-[0_12px_30px_rgba(23,23,20,0.15)]">
            <form onSubmit={handleSearch} className="mx-auto flex max-w-[1540px] items-center gap-3 px-5 py-4 sm:px-8 lg:px-12">
              <Search className="h-5 w-5" strokeWidth={1.25} />
              <label htmlFor="site-search" className="sr-only">Tìm kiếm sản phẩm</label>
              <input id="site-search" autoFocus type="search" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Tìm kiếm sản phẩm" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#252523]/60" />
              <button type="button" onClick={() => setSearchOpen(false)} aria-label="Đóng tìm kiếm" className="transition-opacity hover:opacity-60"><X className="h-5 w-5" strokeWidth={1.25} /></button>
            </form>
          </div>
        )}
      </motion.header>

      <NavigationModal isOpen={isNavOpen} onClose={() => setNavOpen(false)} />
      <CartDrawer />
      <ProductModal />
    </>
  );
}
