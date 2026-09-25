"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/lib/CartContext";
import {
  ArrowRight,
  ShoppingBag,
  Trash2,
  Truck,
  X,
} from "lucide-react";

export default function CartDrawer() {
  const {
    isCartOpen,
    setCartOpen,
    cart,
    cartTotal,
    changeQty,
    storefrontContent,
  } = useCart();

  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);

  // Prevent background scrolling on mobile when cart drawer is open
  useEffect(() => {
    if (isCartOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isCartOpen]);

  // Calculate estimated shipping for preview
  const defaultMethod = storefrontContent.sales.cod?.enabled
    ? storefrontContent.sales.cod
    : Object.values(storefrontContent.sales).find((method) => method.enabled);

  const reachesFreeShipping = Boolean(
    defaultMethod?.free_shipping
      || (defaultMethod?.free_shipping_min_items && itemCount >= defaultMethod.free_shipping_min_items),
  );
  const estimatedShipping = reachesFreeShipping ? 0 : Number(defaultMethod?.shipping_fee ?? 0);
  const grandTotal = cartTotal + estimatedShipping;

  const closeDrawer = () => {
    setCartOpen(false);
  };

  return (
    <div className={`fixed inset-0 z-50 pointer-events-none ${isCartOpen ? "" : "delay-300"}`}>
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/75 backdrop-blur-xs transition-opacity duration-300 pointer-events-auto ${
          isCartOpen ? "opacity-100" : "opacity-0 hidden"
        }`}
        onClick={closeDrawer}
      />

      {/* Main Drawer Shell */}
      <div
        className={`absolute top-0 right-0 h-full max-h-[100dvh] w-full max-w-full sm:max-w-md md:max-w-lg bg-white border-l border-forest-800/15 p-4 sm:p-6 flex flex-col font-ui transform transition-transform duration-300 ease-out pointer-events-auto shadow-2xl ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header - fixed height, non-shrinkable */}
        <div className="flex items-center justify-between border-b border-forest-800/10 pb-3.5 sm:pb-4 shrink-0">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-forest-50 text-forest-800 border border-forest-800/10 shrink-0">
              <ShoppingBag className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
            </div>
            <span className="font-serif text-xl sm:text-2xl md:text-3xl text-forest-950 font-medium tracking-wide">
              Giỏ hàng
            </span>
            <span className="rounded-full bg-forest-100 px-2 py-0.5 text-xs font-bold text-forest-800">
              {itemCount}
            </span>
          </div>
          <button
            type="button"
            onClick={closeDrawer}
            className="flex h-9 w-9 items-center justify-center rounded-full text-forest-700 hover:bg-forest-100 hover:text-forest-950 transition-colors cursor-pointer"
            aria-label="Đóng giỏ hàng"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Cart Items List - scrollable */}
        <div className="flex-1 overflow-y-auto py-3 sm:py-4 space-y-2.5 sm:space-y-3 pr-0.5 min-h-0">
          {cart.length === 0 ? (
            <div className="py-16 sm:py-20 text-center px-4">
              <ShoppingBag className="mx-auto h-12 w-12 sm:h-14 sm:w-14 text-forest-400" strokeWidth={1.2} />
              <h4 className="mt-4 font-serif text-lg sm:text-xl font-medium text-forest-900">Giỏ hàng của bạn đang trống</h4>
              <p className="mt-1.5 text-xs sm:text-sm text-forest-600 max-w-xs mx-auto leading-relaxed">
                Hãy dạo một vòng và chọn cho mình nốt hương yêu thích nhé.
              </p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.cartKey}
                className="flex items-center gap-3 rounded-xl border border-forest-800/15 bg-white p-3 shadow-xs transition-shadow hover:shadow-sm"
              >
                <div className="h-15 w-15 sm:h-17 sm:w-17 flex-shrink-0 overflow-hidden rounded-lg bg-forest-50 border border-forest-800/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="truncate font-serif text-sm sm:text-base font-semibold text-forest-950">{item.name}</h4>
                  <span className="block truncate text-[11px] sm:text-xs text-forest-600">{item.variantLabel}</span>
                  <span className="mt-0.5 block text-xs sm:text-sm font-bold text-forest-900">
                    {item.price.toLocaleString("vi-VN")} đ
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <div className="flex items-center rounded-lg border border-forest-800/20 bg-forest-50/70">
                    <button
                      type="button"
                      onClick={() => changeQty(item.cartKey, -1)}
                      className="h-7 w-7 sm:h-8 sm:w-8 text-sm font-bold text-forest-800 hover:bg-forest-100 flex items-center justify-center transition-colors cursor-pointer"
                      aria-label="Giảm số lượng"
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-xs font-bold text-forest-950">{item.qty}</span>
                    <button
                      type="button"
                      onClick={() => changeQty(item.cartKey, 1)}
                      className="h-7 w-7 sm:h-8 sm:w-8 text-sm font-bold text-forest-800 hover:bg-forest-100 flex items-center justify-center transition-colors cursor-pointer"
                      aria-label="Tăng số lượng"
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => changeQty(item.cartKey, -item.qty)}
                    className="rounded-lg p-1.5 text-forest-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    aria-label={`Xóa ${item.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions - non-shrinkable with mobile safe area */}
        {cart.length > 0 && (
          <div className="space-y-3 border-t border-forest-800/15 bg-white pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] shrink-0">
            <div className="flex items-center gap-2 rounded-xl bg-forest-50 border border-forest-800/10 p-2.5 text-[11px] sm:text-xs font-medium text-forest-800">
              <Truck className="h-3.5 w-3.5 text-amberWood-dark shrink-0" />
              <span className="truncate">
                {estimatedShipping === 0
                  ? "Miễn phí vận chuyển toàn quốc!"
                  : `Phí vận chuyển: ${estimatedShipping.toLocaleString("vi-VN")} đ`}
              </span>
            </div>

            <div className="rounded-xl bg-forest-50/80 border border-forest-800/15 p-3 sm:p-3.5 space-y-1.5 text-xs sm:text-sm">
              <div className="flex justify-between items-center text-forest-700">
                <span className="font-medium">Tạm tính ({itemCount} món)</span>
                <span className="font-semibold text-forest-950">{cartTotal.toLocaleString("vi-VN")} đ</span>
              </div>
              <div className="flex justify-between items-center text-forest-700">
                <span className="font-medium">Phí vận chuyển</span>
                <span className="font-semibold text-forest-950">
                  {estimatedShipping === 0 ? (
                    <span className="text-emerald-700 font-bold bg-emerald-100/80 px-1.5 py-0.5 rounded text-[11px]">
                      Miễn phí
                    </span>
                  ) : (
                    `${estimatedShipping.toLocaleString("vi-VN")} đ`
                  )}
                </span>
              </div>
              <div className="border-t border-forest-800/15 pt-2 flex justify-between items-baseline">
                <span className="block text-sm sm:text-base font-bold text-forest-950">Tổng thanh toán</span>
                <span className="font-serif text-xl sm:text-2xl font-bold text-forest-950">
                  {grandTotal.toLocaleString("vi-VN")} đ
                </span>
              </div>
            </div>

            <Link
              href="/thanh-toan"
              onClick={closeDrawer}
              className="flex h-12 sm:h-13 w-full items-center justify-center gap-2 rounded-xl bg-forest-900 hover:bg-forest-950 active:scale-[0.99] text-sm sm:text-base font-bold tracking-wide text-white shadow-md transition-all cursor-pointer"
            >
              <span>Tiến hành đặt hàng</span>
              <ArrowRight className="h-4.5 w-4.5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
