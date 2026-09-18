"use client";

import { FormEvent, useMemo, useState } from "react";
import { useCart } from "@/lib/CartContext";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Copy, QrCode, ShoppingBag, Trash2, Truck, X } from "lucide-react";

type CheckoutForm = {
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  province: string;
  ward: string;
  address: string;
  note: string;
  payment_method: string;
};

type CheckoutResult = {
  order_code: string;
  total_amount: number;
  shipping_fee: number;
  message?: string;
};

const initialForm: CheckoutForm = {
  customer_name: "",
  customer_phone: "",
  customer_email: "",
  province: "",
  ward: "",
  address: "",
  note: "",
  payment_method: "cod",
};

const paymentLabels: Record<string, string> = {
  cod: "Thanh toán khi nhận hàng",
  bank_transfer: "Chuyển khoản",
};

export default function CartDrawer() {
  const {
    isCartOpen,
    setCartOpen,
    cart,
    cartTotal,
    changeQty,
    clearCart,
    storefrontContent,
  } = useCart();
  const enabledMethods = useMemo(
    () => Object.entries(storefrontContent.sales).filter(([, config]) => config.enabled),
    [storefrontContent.sales],
  );
  const defaultPaymentMethod = enabledMethods.some(([key]) => key === "cod")
    ? "cod"
    : enabledMethods[0]?.[0] ?? "cod";
  const [checkoutMode, setCheckoutMode] = useState(false);
  const [form, setForm] = useState<CheckoutForm>({
    ...initialForm,
    payment_method: defaultPaymentMethod,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<CheckoutResult | null>(null);

  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const salesMethod = storefrontContent.sales[form.payment_method];
  const reachesFreeShipping = Boolean(
    salesMethod?.free_shipping
      || (salesMethod?.free_shipping_min_items && itemCount >= salesMethod.free_shipping_min_items),
  );
  const estimatedShipping = reachesFreeShipping ? 0 : Number(salesMethod?.shipping_fee ?? 0);
  const grandTotal = cartTotal + estimatedShipping;

  const closeDrawer = () => {
    setCartOpen(false);
    window.setTimeout(() => {
      setCheckoutMode(false);
      setError("");
      if (result) {
        setResult(null);
        setForm({ ...initialForm, payment_method: defaultPaymentMethod });
      }
    }, 250);
  };

  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2500);
      }).catch(() => {});
    }
  };

  const submitOrder = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (cart.length === 0) {
      setError("Giỏ hàng đang trống.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          ...form,
          customer_email: form.customer_email || null,
          note: form.note || null,
          total_amount: grandTotal,
          items: cart.map((item) => ({
            product_id: item.id,
            variant_id: item.variantId || `${item.id}-default`,
            name: item.name,
            price: item.price,
            quantity: item.qty,
          })),
        }),
      });
      const payload = await response.json();

      if (!response.ok || !payload.success) {
        const validationMessage = payload.errors
          ? Object.values(payload.errors).flat().join(" ")
          : null;
        throw new Error(validationMessage || payload.error || "Không thể tạo đơn hàng.");
      }

      setResult({
        order_code: payload.order_code,
        total_amount: Number(payload.total_amount) || grandTotal,
        shipping_fee: Number(payload.shipping_fee) || estimatedShipping,
        message: payload.message,
      });
      clearCart();
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : "Không thể tạo đơn hàng.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 pointer-events-none ${isCartOpen ? "" : "delay-300"}`}>
      <div
        className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 pointer-events-auto ${isCartOpen ? "opacity-100" : "opacity-0 hidden"}`}
        onClick={closeDrawer}
      />

      <div className={`absolute top-0 right-0 bottom-0 w-full max-w-xl bg-white border-l border-forest-800/15 p-5 sm:p-6 flex flex-col transform transition-transform duration-300 ease-out pointer-events-auto shadow-2xl ${isCartOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between border-b border-forest-800/10 pb-4">
          <div className="flex items-center gap-2">
            {checkoutMode && !result ? (
              <button type="button" onClick={() => setCheckoutMode(false)} className="p-1 text-forest-700" aria-label="Quay lại giỏ hàng">
                <ArrowLeft className="h-5 w-5" />
              </button>
            ) : (
              <ShoppingBag className="h-5 w-5 text-forest-700" />
            )}
            <span className="font-serif text-xl text-forest-950 tracking-wider">
              {result ? "Đặt hàng thành công" : checkoutMode ? "Thông tin nhận hàng" : "Giỏ hàng"}
            </span>
            {!checkoutMode && !result && <span className="text-xs text-forest-700">({itemCount})</span>}
          </div>
          <button type="button" onClick={closeDrawer} className="p-1.5 rounded-full text-forest-700 hover:bg-forest-50" aria-label="Đóng giỏ hàng">
            <X className="h-5 w-5" />
          </button>
        </div>

        {result ? (
          <div className="flex flex-1 flex-col overflow-y-auto py-6 px-1">
            <div className="text-center">
              <CheckCircle2 className="mx-auto h-12 w-12 text-forest-700" strokeWidth={1.4} />
              <h3 className="mt-3 font-serif text-2xl text-forest-950 font-light">RUNGU đã nhận đơn của bạn</h3>
              <p className="mt-1 text-xs text-forest-600">
                Mã đơn hàng: <strong className="font-mono text-sm text-forest-900">{result.order_code}</strong>
              </p>
              <p className="mt-1 text-xs text-forest-600">
                Tổng thanh toán: <strong className="font-serif text-base text-forest-900">{result.total_amount.toLocaleString("vi-VN")} đ</strong>
              </p>
            </div>

            {form.payment_method === "bank_transfer" ? (
              <div className="mt-6 border border-forest-800/15 bg-[#faf8f4] p-4 text-left">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-forest-900 mb-3">
                  <QrCode className="h-4 w-4 text-[#8d693a]" />
                  <span>Quét mã VietQR chuyển khoản</span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="relative aspect-square w-40 overflow-hidden rounded-lg border border-forest-800/10 bg-white p-2 shadow-sm shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://img.vietqr.io/image/MB-0868238690-compact2.png?amount=${result.total_amount}&addInfo=${result.order_code}&accountName=RUNGU%20BOTANICAL`}
                      alt={`Mã QR thanh toán đơn hàng ${result.order_code}`}
                      className="h-full w-full object-contain"
                    />
                  </div>

                  <div className="flex-1 space-y-2 text-xs text-forest-800">
                    <div>
                      <span className="text-[11px] text-forest-500 block">Ngân hàng</span>
                      <strong className="text-forest-900">MB Bank (Ngân hàng Quân Đội)</strong>
                    </div>

                    <div>
                      <span className="text-[11px] text-forest-500 block">Số tài khoản</span>
                      <div className="flex items-center gap-2">
                        <strong className="font-mono text-forest-900">0868 238 690</strong>
                        <button
                          type="button"
                          onClick={() => copyToClipboard("0868238690", "stk")}
                          className="inline-flex items-center gap-1 rounded bg-white px-2 py-0.5 text-[10px] border border-forest-800/20 text-forest-700 hover:text-forest-950"
                        >
                          {copiedField === "stk" ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
                          <span>{copiedField === "stk" ? "Đã chép" : "Sao chép"}</span>
                        </button>
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] text-forest-500 block">Chủ tài khoản</span>
                      <strong className="text-forest-900">RUNGU BOTANICAL</strong>
                    </div>

                    <div>
                      <span className="text-[11px] text-forest-500 block">Nội dung chuyển khoản</span>
                      <div className="flex items-center gap-2">
                        <strong className="font-mono text-[#8d693a]">{result.order_code}</strong>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(result.order_code, "code")}
                          className="inline-flex items-center gap-1 rounded bg-white px-2 py-0.5 text-[10px] border border-forest-800/20 text-forest-700 hover:text-forest-950"
                        >
                          {copiedField === "code" ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
                          <span>{copiedField === "code" ? "Đã chép" : "Sao chép"}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="mt-3 text-[11px] text-forest-600 border-t border-forest-800/10 pt-2.5">
                  ✦ Hệ thống sẽ tự động xác nhận đơn và gửi tin nhắn cập nhật trạng thái ngay khi nhận được thanh toán.
                </p>
              </div>
            ) : (
              <div className="mt-6 border border-forest-800/15 bg-[#faf8f4] p-4 text-left text-xs space-y-2">
                <div className="flex items-center gap-2 font-semibold uppercase tracking-wider text-forest-900">
                  <Truck className="h-4 w-4 text-[#8d693a]" />
                  <span>Hình thức: Thanh toán khi nhận hàng (COD)</span>
                </div>
                <p className="text-forest-700 leading-relaxed">
                  Đơn hàng của bạn sẽ được nghệ nhân RUNGU chuẩn bị và đóng gói mộc mạc cẩn thận. Bạn có thể kiểm tra sản phẩm trước khi thanh toán cho nhân viên giao hàng.
                </p>
                <p className="text-forest-600 text-[11px] pt-1">
                  Thời gian giao hàng dự kiến từ 2-4 ngày làm việc. Cần hỗ trợ khẩn cấp, vui lòng liên hệ hotline <strong>0868 238 690</strong>.
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={closeDrawer}
              className="mt-7 w-full bg-forest-800 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-white hover:bg-forest-900 transition-colors"
            >
              Tiếp tục mua sắm
            </button>
          </div>
        ) : checkoutMode ? (
          <form onSubmit={submitOrder} className="flex min-h-0 flex-1 flex-col">
            <div className="flex-1 space-y-4 overflow-y-auto py-5 pr-1">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Họ và tên" required value={form.customer_name} onChange={(value) => setForm({ ...form, customer_name: value })} />
                <Field label="Số điện thoại" required type="tel" value={form.customer_phone} onChange={(value) => setForm({ ...form, customer_phone: value })} />
              </div>
              <Field label="Email (không bắt buộc)" type="email" value={form.customer_email} onChange={(value) => setForm({ ...form, customer_email: value })} />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Tỉnh / Thành phố" required value={form.province} onChange={(value) => setForm({ ...form, province: value })} />
                <Field label="Phường / Xã" required value={form.ward} onChange={(value) => setForm({ ...form, ward: value })} />
              </div>
              <Field label="Số nhà, tên đường" required value={form.address} onChange={(value) => setForm({ ...form, address: value })} />

              <label className="block text-xs text-forest-800">
                <span className="mb-1.5 block font-medium">Ghi chú</span>
                <textarea value={form.note} onChange={(event) => setForm({ ...form, note: event.target.value })} rows={3} className="w-full border border-forest-800/20 bg-white px-3 py-2.5 outline-none focus:border-forest-800" />
              </label>

              <fieldset className="space-y-2">
                <legend className="mb-1.5 text-xs font-medium text-forest-800">Hình thức thanh toán</legend>
                {enabledMethods.map(([key]) => (
                  <label key={key} className={`flex cursor-pointer items-center gap-3 border p-3 text-xs ${form.payment_method === key ? "border-forest-800 bg-forest-50" : "border-forest-800/15"}`}>
                    <input type="radio" name="payment_method" value={key} checked={form.payment_method === key} onChange={() => setForm({ ...form, payment_method: key })} />
                    <span>{paymentLabels[key] ?? key}</span>
                  </label>
                ))}
              </fieldset>

              {error && <p role="alert" className="border border-red-200 bg-red-50 p-3 text-xs leading-5 text-red-700">{error}</p>}
            </div>

            <div className="space-y-3 border-t border-forest-800/10 pt-4">
              <Summary subtotal={cartTotal} shipping={estimatedShipping} total={grandTotal} />
              <button type="submit" disabled={submitting || enabledMethods.length === 0} className="w-full bg-forest-800 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-white disabled:cursor-not-allowed disabled:opacity-50">
                {submitting ? "Đang tạo đơn..." : "Xác nhận đặt hàng"}
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {cart.length === 0 ? (
                <div className="py-16 text-center">
                  <ShoppingBag className="mx-auto h-12 w-12 text-forest-500" strokeWidth={1.3} />
                  <p className="mt-4 text-sm text-forest-700">Giỏ hàng của bạn đang trống.</p>
                </div>
              ) : cart.map((item) => (
                <div key={item.cartKey} className="flex items-center gap-3.5 border border-forest-800/10 bg-white p-3.5 shadow-sm">
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden bg-forest-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="truncate font-serif text-sm font-medium text-forest-950">{item.name}</h4>
                    <span className="mt-0.5 block truncate text-[11px] text-forest-600">{item.variantLabel}</span>
                    <span className="block text-xs font-semibold text-forest-800">{item.price.toLocaleString("vi-VN")} đ</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center border border-forest-800/20 bg-forest-50/50">
                      <button type="button" onClick={() => changeQty(item.cartKey, -1)} className="h-7 w-7 text-xs">−</button>
                      <span className="px-1.5 text-xs font-medium">{item.qty}</span>
                      <button type="button" onClick={() => changeQty(item.cartKey, 1)} className="h-7 w-7 text-xs">+</button>
                    </div>
                    <button type="button" onClick={() => changeQty(item.cartKey, -item.qty)} className="p-1.5 text-forest-400 hover:text-red-600" aria-label={`Xóa ${item.name}`}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {cart.length > 0 && (
              <div className="space-y-4 border-t border-forest-800/10 pt-4">
                <div className="flex items-center gap-2 bg-forest-50 p-3 text-xs text-forest-700">
                  <Truck className="h-4 w-4" />
                  {estimatedShipping === 0 ? "Đơn hàng được miễn phí vận chuyển" : `Phí vận chuyển dự kiến ${estimatedShipping.toLocaleString("vi-VN")} đ`}
                </div>
                <Summary subtotal={cartTotal} shipping={estimatedShipping} total={grandTotal} />
                <button type="button" onClick={() => { setCheckoutMode(true); setError(""); }} className="flex w-full items-center justify-center gap-2 bg-forest-800 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-white">
                  <span>Tiến hành đặt hàng</span><ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  required = false,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="block text-xs text-forest-800">
      <span className="mb-1.5 block font-medium">{label}</span>
      <input type={type} required={required} value={value} onChange={(event) => onChange(event.target.value)} className="w-full border border-forest-800/20 bg-white px-3 py-2.5 outline-none focus:border-forest-800" />
    </label>
  );
}

function Summary({ subtotal, shipping, total }: { subtotal: number; shipping: number; total: number }) {
  return (
    <div className="space-y-1.5 text-xs text-forest-700">
      <div className="flex justify-between"><span>Tạm tính</span><span>{subtotal.toLocaleString("vi-VN")} đ</span></div>
      <div className="flex justify-between"><span>Vận chuyển</span><span>{shipping === 0 ? "Miễn phí" : `${shipping.toLocaleString("vi-VN")} đ`}</span></div>
      <div className="flex justify-between border-t border-forest-800/10 pt-2 text-sm font-medium text-forest-950"><span>Tổng cộng</span><span className="font-serif text-xl">{total.toLocaleString("vi-VN")} đ</span></div>
    </div>
  );
}
