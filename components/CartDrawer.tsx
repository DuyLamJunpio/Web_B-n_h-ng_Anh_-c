"use client";

import { useCart } from "@/lib/CartContext";
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Truck } from "lucide-react";

export default function CartDrawer() {
  const { isCartOpen, setCartOpen, cart, cartTotal, changeQty, clearCart } =
    useCart();

  const FREE_SHIPPING_THRESHOLD = 500000;
  const remainingForFreeShip = Math.max(0, FREE_SHIPPING_THRESHOLD - cartTotal);
  const freeShipPercent = Math.min(100, (cartTotal / FREE_SHIPPING_THRESHOLD) * 100);

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Giỏ hàng của bạn đang trống.");
      return;
    }
    alert(
      "Cảm ơn bạn đã lựa chọn hành trình chữa lành cùng Trầm & Khói.\n\nĐơn hàng của bạn đang được chuẩn bị với trọn vẹn sự tĩnh tâm và sẽ sớm được liên hệ xác nhận!"
    );
    clearCart();
    setCartOpen(false);
  };

  return (
    <div
      className={`fixed inset-0 z-50 pointer-events-none ${
        isCartOpen ? "" : "delay-300"
      }`}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 pointer-events-auto ${
          isCartOpen ? "opacity-100" : "opacity-0 hidden"
        }`}
        onClick={() => setCartOpen(false)}
      />

      {/* Panel */}
      <div
        className={`absolute top-0 right-0 bottom-0 w-full max-w-md bg-white border-l border-forest-800/15 p-6 flex flex-col justify-between transform transition-transform duration-300 ease-out pointer-events-auto shadow-2xl ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Cart Header */}
        <div className="space-y-4 pb-4 border-b border-forest-800/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-forest-700" />
              <span className="font-serif text-xl text-forest-950 tracking-wider">
                Giỏ Hàng Tĩnh Tại
              </span>
              <span className="text-xs text-forest-700 font-serif">
                ({cart.reduce((s, i) => s + i.qty, 0)})
              </span>
            </div>
            <button
              onClick={() => setCartOpen(false)}
              className="text-forest-700 hover:text-forest-950 text-xl p-1.5 rounded-full hover:bg-forest-50 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free shipping status bar */}
          <div className="bg-forest-50/70 p-3 rounded-sm border border-forest-800/10 space-y-2 text-xs">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-forest-800 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-forest-700" />
                {remainingForFreeShip === 0 ? (
                  <span className="text-forest-700 font-semibold">Đủ điều kiện Miễn Phí Vận Chuyển Toàn Quốc!</span>
                ) : (
                  <span>Mua thêm <strong className="text-forest-900">{remainingForFreeShip.toLocaleString("vi-VN")} đ</strong> để Freeship</span>
                )}
              </span>
              <span className="text-forest-600 font-mono">{Math.round(freeShipPercent)}%</span>
            </div>
            <div className="w-full h-1.5 bg-forest-200/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-forest-700 to-forest-500 transition-all duration-500 rounded-full"
                style={{ width: `${freeShipPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {cart.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-forest-50 border border-forest-800/10 flex items-center justify-center text-forest-600 mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <p className="text-forest-700 text-sm font-light">
                Giỏ hàng của bạn đang trống.
              </p>
              <button
                onClick={() => setCartOpen(false)}
                className="px-6 py-2.5 bg-forest-800 text-white hover:bg-forest-700 text-xs uppercase tracking-widest font-semibold rounded-sm transition-all cursor-pointer shadow-md"
              >
                Khám Phá Sản Phẩm
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="p-3.5 bg-white border border-forest-800/10 rounded-sm flex items-center gap-3.5 group hover:border-forest-800/30 transition-colors shadow-sm"
              >
                {/* Thumbnail */}
                <div className="w-16 h-16 rounded-sm overflow-hidden border border-forest-800/10 flex-shrink-0 bg-forest-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-serif text-forest-950 text-sm truncate font-medium">
                    {item.name}
                  </h4>
                  <span className="text-xs text-forest-800 font-semibold block mt-0.5">
                    {item.price.toLocaleString("vi-VN")} đ
                  </span>
                  <span className="text-[10px] text-forest-600 block truncate">
                    {item.origin}
                  </span>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center border border-forest-800/20 rounded-sm bg-forest-50/50">
                    <button
                      onClick={() => changeQty(item.id, -1)}
                      className="w-6 h-6 text-forest-700 hover:text-forest-950 flex items-center justify-center text-xs transition-colors cursor-pointer"
                    >
                      -
                    </button>
                    <span className="text-xs text-forest-950 px-1.5 font-medium">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => changeQty(item.id, 1)}
                      className="w-6 h-6 text-forest-700 hover:text-forest-950 flex items-center justify-center text-xs transition-colors cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => changeQty(item.id, -item.qty)}
                    className="p-1.5 text-forest-400 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Xóa sản phẩm"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cart Footer */}
        {cart.length > 0 && (
          <div className="pt-4 border-t border-forest-800/10 space-y-4">
            <div className="space-y-1.5 text-xs text-forest-700">
              <div className="flex justify-between">
                <span>Tạm tính:</span>
                <span className="text-forest-950 font-medium">{cartTotal.toLocaleString("vi-VN")} đ</span>
              </div>
              <div className="flex justify-between">
                <span>Vận chuyển:</span>
                <span className="text-forest-700 font-semibold">
                  {remainingForFreeShip === 0 ? "Miễn Phí" : "Tính khi thanh toán"}
                </span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-forest-800/10">
                <span className="text-forest-950 font-medium text-sm">Tổng cộng:</span>
                <span className="font-serif text-2xl text-forest-800 font-semibold">
                  {cartTotal.toLocaleString("vi-VN")} đ
                </span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full py-3.5 bg-forest-800 hover:bg-forest-700 text-white font-semibold text-xs tracking-[0.2em] uppercase transition-all rounded-sm flex items-center justify-center gap-2 shadow-lg shadow-forest-900/15 cursor-pointer"
            >
              <span>Tiến Hành Đặt Hàng</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-forest-600 uppercase tracking-widest">
              <ShieldCheck className="w-3.5 h-3.5 text-forest-700" />
              <span>Thanh toán an toàn • Kiểm tra hàng trước khi nhận</span>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
