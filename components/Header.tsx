"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/CartContext";
import NavigationModal from "./NavigationModal";
import CartDrawer from "./CartDrawer";
import ProductModal from "./ProductModal";
import { Volume2, VolumeX, ShoppingBag, Sparkles } from "lucide-react";

export default function Header() {
  const { cartCount, setCartOpen } = useCart();
  const [isNavOpen, setNavOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  // Audio Context Ref for 432Hz Ambient Resonance
  const audioCtxRef = useRef<AudioContext | null>(null);
  const osc1Ref = useRef<OscillatorNode | null>(null);
  const osc2Ref = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 30);

      // Auto-hide when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY.current && currentScrollY > 120) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleSound = () => {
    if (!isPlaying) {
      try {
        const AudioContextClass =
          window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioContextClass();
        audioCtxRef.current = ctx;

        if (ctx.state === "suspended") {
          ctx.resume();
        }

        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gainNode = ctx.createGain();

        // 432Hz Ambient Resonance Harmonics
        osc1.type = "sine";
        osc1.frequency.setValueAtTime(108, ctx.currentTime);

        osc2.type = "sine";
        osc2.frequency.setValueAtTime(216, ctx.currentTime);

        gainNode.gain.setValueAtTime(0.01, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.04, ctx.currentTime + 3);

        osc1.connect(gainNode);
        osc2.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc1.start();
        osc2.start();

        osc1Ref.current = osc1;
        osc2Ref.current = osc2;
        gainNodeRef.current = gainNode;

        setIsPlaying(true);
      } catch (err) {
        console.error("Audio Context error:", err);
      }
    } else {
      const ctx = audioCtxRef.current;
      const gainNode = gainNodeRef.current;
      if (ctx && gainNode) {
        gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1);
        setTimeout(() => {
          try {
            osc1Ref.current?.stop();
            osc2Ref.current?.stop();
            ctx.close();
          } catch {}
        }, 1000);
      }
      setIsPlaying(false);
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: 0 }}
        animate={{ y: isVisible ? 0 : -100 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-500 ${
          isScrolled
            ? "bg-white/90 backdrop-blur-xl border-b border-forest-800/10 shadow-lg shadow-forest-900/5 py-3"
            : "bg-gradient-to-b from-white/90 via-white/50 to-transparent border-b border-forest-800/5 py-5"
        }`}
      >
        {/* 3-Column Mathematically Centered Grid Layout */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 grid grid-cols-3 items-center w-full">
          
          {/* 1. LEFT COLUMN: Hamburger Menu & Quick Navigation Links */}
          <div className="justify-self-start flex items-center gap-6 sm:gap-8">
            <button
              onClick={() => setNavOpen(true)}
              aria-label="Mở menu điều hướng"
              className="flex items-center gap-3 text-forest-900 hover:text-forest-700 transition-colors group p-1.5 -ml-1.5 cursor-pointer"
            >
              <div className="flex flex-col gap-1.5 w-6">
                <span className="h-[1.5px] bg-forest-900 group-hover:bg-forest-700 transition-all w-6"></span>
                <span className="h-[1.5px] bg-forest-900 group-hover:bg-forest-700 transition-all w-4 group-hover:w-6"></span>
                <span className="h-[1.5px] bg-forest-900 group-hover:bg-forest-700 transition-all w-5 group-hover:w-6"></span>
              </div>
              <span className="text-xs uppercase tracking-[0.25em] font-medium hidden sm:inline-block">
                Danh Mục
              </span>
            </button>

            {/* Desktop Direct Quick Links */}
            <nav className="hidden lg:flex items-center gap-6 text-[11px] uppercase tracking-[0.2em] font-medium text-forest-800/80">
              <a
                href="#about"
                className="hover:text-forest-900 transition-colors hover-underline"
              >
                Triết Lý
              </a>
              <a
                href="#collections"
                className="hover:text-forest-900 transition-colors hover-underline"
              >
                Vật Phẩm
              </a>
              <a
                href="#quiz"
                className="hover:text-forest-900 transition-colors hover-underline"
              >
                Trắc Nghiệm
              </a>
              <a
                href="#ritual"
                className="hover:text-forest-900 transition-colors hover-underline"
              >
                Nghi Thức
              </a>
            </nav>
          </div>

          {/* 2. CENTER COLUMN: Mathematically Centered Brand Logo */}
          <div className="justify-self-center text-center">
            <a href="#" className="inline-block text-center group cursor-pointer">
              <span className="font-serif text-2xl sm:text-3xl lg:text-4xl tracking-[0.25em] text-forest-950 font-light block group-hover:text-forest-700 transition-colors whitespace-nowrap">
                TRẦM & KHÓI
              </span>
              <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.45em] text-forest-700 block -mt-0.5 font-sans font-semibold">
                Aura & Rituals
              </span>
            </a>
          </div>

          {/* 3. RIGHT COLUMN: 432Hz Ambient Sound & Cart Drawer Trigger */}
          <div className="justify-self-end flex items-center justify-end gap-3 sm:gap-5">
            {/* 432Hz Sound Synthesizer Button */}
            <button
              onClick={toggleSound}
              title={isPlaying ? "Tắt âm tần 432Hz" : "Bật âm tần thiền 432Hz"}
              className={`text-xs flex items-center gap-2 border px-3.5 py-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                isPlaying
                  ? "border-forest-600 text-forest-800 bg-forest-100 shadow-md shadow-forest-600/10"
                  : "border-forest-800/15 text-forest-800 hover:text-forest-950 hover:border-forest-700 bg-white/80"
              }`}
            >
              {isPlaying ? (
                <>
                  <span className="flex gap-0.5 items-end h-3">
                    <span className="w-0.5 h-3 bg-forest-700 animate-pulse"></span>
                    <span className="w-0.5 h-2 bg-forest-700 animate-pulse delay-75"></span>
                    <span className="w-0.5 h-3.5 bg-forest-700 animate-pulse delay-150"></span>
                  </span>
                  <span className="hidden md:inline font-mono text-[11px] font-semibold">432Hz Đang Phát</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-forest-700" />
                  <span className="hidden md:inline text-[11px] uppercase tracking-wider font-medium">Âm Tần 432Hz</span>
                </>
              )}
            </button>

            {/* Cart Trigger */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 text-forest-900 hover:text-forest-700 transition-colors flex items-center gap-2 cursor-pointer group"
              aria-label="Giỏ hàng"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-forest-900 group-hover:text-forest-700 transition-colors" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-forest-800 text-white flex items-center justify-center text-[10px] font-bold shadow-md shadow-forest-800/30 animate-scale">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="font-serif text-sm tracking-widest hidden sm:inline text-forest-900 group-hover:text-forest-700 transition-colors font-medium">
                GIỎ HÀNG
              </span>
            </button>
          </div>

        </div>
      </motion.header>

      {/* Fullscreen Navigation Modal */}
      <NavigationModal isOpen={isNavOpen} onClose={() => setNavOpen(false)} />

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Product Quick View Modal */}
      <ProductModal />
    </>
  );
}
