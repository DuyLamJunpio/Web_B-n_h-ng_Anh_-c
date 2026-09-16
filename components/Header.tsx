"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/lib/CartContext";
import NavigationModal from "./NavigationModal";
import CartDrawer from "./CartDrawer";
import ProductModal from "./ProductModal";

const navItems = [
  { href: "#collections", label: "Tất cả" },
  { href: "#collections", label: "Mới & đáng chú ý" },
  { href: "#collections", label: "Thanh tẩy" },
  { href: "#collections", label: "Cơ thể & tóc" },
  { href: "#collections", label: "Hương thơm" },
  { href: "#collections", label: "Nhà cửa" },
  { href: "#collections", label: "Quà tặng" },
  { href: "#about", label: "Thư viện" },
  { href: "#about", label: "Trải nghiệm" },
];

export default function Header() {
  const { cartCount, setCartOpen } = useCart();
  const [isNavOpen, setNavOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    document.querySelector("#collections")?.scrollIntoView({ behavior: "smooth" });
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
                <a href="#about" className="header-link">Cửa hàng</a>
                <a href="#about" className="header-link">Chăm sóc khách hàng</a>
              </div>

              <a href="#" aria-label="RUNGU, trang chủ" className="absolute left-1/2 flex -translate-x-1/2 items-center transition-opacity hover:opacity-70">
                <Image src="/rungu-logo.png" alt="RUNGU" width={2172} height={724} priority className="header-logo h-auto w-[165px] sm:w-[190px]" />
              </a>

              <div className="ml-auto flex items-center gap-4 text-xs font-medium sm:gap-6">
                <a href="#about" className="header-link hidden sm:inline">Đăng ký email</a>
                <button type="button" onClick={() => setNavOpen(true)} className="header-link hidden sm:inline">Tài khoản</button>
                <button type="button" onClick={() => setCartOpen(true)} className="header-link">Giỏ hàng ({cartCount})</button>
                <button type="button" onClick={() => setNavOpen(true)} aria-label="Mở menu" className="header-icon lg:hidden">
                  <Menu className="h-5 w-5" strokeWidth={1.35} />
                </button>
              </div>
            </div>

            <div className="relative hidden min-h-[58px] items-center lg:flex">
              <nav aria-label="Điều hướng chính" className="absolute left-1/2 flex -translate-x-1/2 items-center gap-3 xl:gap-6">
                {navItems.map((item) => (
                  <a key={item.label} href={item.href} className="header-nav-link flex h-full items-center whitespace-nowrap px-1 py-5 text-[13px] font-medium leading-none">
                    {item.label}
                  </a>
                ))}
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
