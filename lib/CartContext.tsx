"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Product } from "./data";
import type { StorefrontCategory, StorefrontContent } from "./catalog";

export type { Product } from "./data";
export const PRIMARY_CATEGORY_SLUGS = [
  "sang-tao",
  "huong-thom",
  "go-hoa-co",
  "dat-va-da",
  "phu-kien",
  "qua-tang",
] as const;
export type CartItem = Product & {
  qty: number;
  cartKey: string;
  variantId: string | null;
  variantLabel: string;
  availableStock: number | null;
};

function reconcileCart(saved: unknown, products: Product[]): CartItem[] {
  if (!Array.isArray(saved)) return [];

  const byProductId = new Map(products.map((product) => [product.id, product]));
  const refreshed = new Map<string, CartItem>();
  for (const raw of saved) {
    if (!raw || typeof raw !== "object") continue;
    const product = byProductId.get(String(raw.id));
    const variant = product?.variants?.find((item) => item.id === String(raw.variantId));
    if (!product || product.inStock === false || !variant || variant.available === false
      || !/^[1-9]\d*$/.test(variant.id)) continue;

    const stock = product.manageStock ? Math.max(0, Math.floor(variant.stock)) : null;
    if (stock === 0) continue;
    const requested = Math.floor(Number(raw.qty));
    if (!Number.isSafeInteger(requested) || requested < 1) continue;

    const cartKey = `${product.id}:${variant.id}`;
    const previous = refreshed.get(cartKey);
    const limit = Math.min(100, stock ?? 100);
    const qty = Math.min(limit, (previous?.qty ?? 0) + requested);
    refreshed.set(cartKey, {
      ...product,
      price: variant.price,
      qty,
      cartKey,
      variantId: variant.id,
      variantLabel: variant.label,
      availableStock: stock,
    });
  }

  return Array.from(refreshed.values());
}

type CartContextType = {
  cart: CartItem[];
  addToCart: (productId: string, variantId?: string, quantity?: number) => boolean;
  changeQty: (cartKey: string, delta: number) => void;
  cartCount: number;
  cartTotal: number;
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  clearCart: () => void;
  products: Product[];
  categories: StorefrontCategory[];
  storefrontContent: StorefrontContent;
  // Categories & Filtering
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  // Product Modal
  selectedProduct: Product | null;
  openProductModal: (id: string) => void;
  closeProductModal: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({
  children,
  products,
  categories,
  storefrontContent,
}: {
  children: ReactNode;
  products: Product[];
  categories: StorefrontCategory[];
  storefrontContent: StorefrontContent;
}) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartHydrated, setCartHydrated] = useState(false);
  const [isCartOpen, setCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = window.localStorage.getItem("rungu-cart");
        if (saved) {
          setCart(reconcileCart(JSON.parse(saved), products));
        }
      } catch {
        window.localStorage.removeItem("rungu-cart");
      } finally {
        setCartHydrated(true);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, [products]);

  useEffect(() => {
    if (!cartHydrated) return;
    setCart((current) => reconcileCart(current, products));
  }, [products, cartHydrated]);

  useEffect(() => {
    if (cartHydrated) window.localStorage.setItem("rungu-cart", JSON.stringify(cart));
  }, [cart, cartHydrated]);

  const addToCart = (productId: string, variantId?: string, quantity = 1) => {
    const product = products.find((p) => p.id === productId);
    if (!product || product.inStock === false) return false;

    const variants = product.variants ?? [];
    const variant = variantId
      ? variants.find((item) => item.id === variantId && item.available)
      : variants.find((item) => item.available);

    if (!variant || !/^[1-9]\d*$/.test(variant.id)) return false;

    const cartKey = `${product.id}:${variant?.id ?? "default"}`;
    const availableStock = product.manageStock && variant ? variant.stock : null;
    const requested = Math.max(1, Math.min(100, Math.floor(quantity)));

    setCart((prev) => {
      const existing = prev.find((item) => item.cartKey === cartKey);
      if (existing) {
        const nextQty = Math.min(100, availableStock ?? 100, existing.qty + requested);

        return prev.map((item) =>
          item.cartKey === cartKey ? { ...item, qty: nextQty } : item
        );
      }

      return [...prev, {
        ...product,
        price: variant?.price ?? product.price,
        qty: Math.min(100, availableStock ?? 100, requested),
        cartKey,
        variantId: variant?.id ?? null,
        variantLabel: variant?.label ?? "Mặc định",
        availableStock,
      }];
    });
    setCartOpen(true);
    return true;
  };

  const changeQty = (cartKey: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.cartKey !== cartKey) return item;
          const nextQty = Math.min(100, item.availableStock ?? 100, item.qty + delta);
          return { ...item, qty: nextQty };
        })
        .filter((item) => item.qty > 0)
    );
  };

  const clearCart = () => setCart([]);

  const openProductModal = (id: string) => {
    const p = products.find((item) => item.id === id);
    if (p) setSelectedProduct(p);
  };
  const closeProductModal = () => setSelectedProduct(null);

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        changeQty,
        cartCount,
        cartTotal,
        isCartOpen,
        setCartOpen,
        clearCart,
        products,
        categories,
        storefrontContent,
        selectedCategory,
        setSelectedCategory,
        selectedProduct,
        openProductModal,
        closeProductModal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
