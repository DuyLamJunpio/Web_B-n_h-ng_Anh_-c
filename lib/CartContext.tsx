"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import type { Product } from "./data";

export type { Product } from "./data";
export type CartItem = Product & { qty: number };

type CartContextType = {
  cart: CartItem[];
  addToCart: (productId: string) => void;
  changeQty: (productId: string, delta: number) => void;
  cartCount: number;
  cartTotal: number;
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  clearCart: () => void;
  products: Product[];
  // Categories & Filtering
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  // Product Modal
  selectedProduct: Product | null;
  openProductModal: (id: string) => void;
  closeProductModal: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children, products }: { children: ReactNode; products: Product[] }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const addToCart = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === productId);
      if (existing) {
        return prev.map((item) =>
          item.id === productId ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setCartOpen(true);
  };

  const changeQty = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === productId ? { ...item, qty: item.qty + delta } : item
        )
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
