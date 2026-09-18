"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Product } from "./data";
import type { StorefrontContent } from "./catalog";

export type { Product } from "./data";
export type CartItem = Product & {
  qty: number;
  cartKey: string;
  variantId: string | null;
  variantLabel: string;
  availableStock: number | null;
};

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
  storefrontContent,
}: {
  children: ReactNode;
  products: Product[];
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
          const parsed = JSON.parse(saved) as CartItem[];
          if (Array.isArray(parsed)) setCart(parsed.filter((item) => item?.cartKey && item.qty > 0));
        }
      } catch {
        window.localStorage.removeItem("rungu-cart");
      } finally {
        setCartHydrated(true);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

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

    if (variants.length > 0 && !variant) return false;

    const cartKey = `${product.id}:${variant?.id ?? "default"}`;
    const availableStock = product.manageStock && variant ? variant.stock : null;
    const requested = Math.max(1, quantity);

    setCart((prev) => {
      const existing = prev.find((item) => item.cartKey === cartKey);
      if (existing) {
        const nextQty = availableStock === null
          ? existing.qty + requested
          : Math.min(availableStock, existing.qty + requested);

        return prev.map((item) =>
          item.cartKey === cartKey ? { ...item, qty: nextQty } : item
        );
      }

      return [...prev, {
        ...product,
        price: variant?.price ?? product.price,
        qty: availableStock === null ? requested : Math.min(availableStock, requested),
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
          const nextQty = item.availableStock === null
            ? item.qty + delta
            : Math.min(item.availableStock, item.qty + delta);
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
