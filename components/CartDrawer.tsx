"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useCart } from "@/lib/CartContext";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Copy, ShoppingBag, Trash2, Truck, X } from "lucide-react";

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
  checkout_ref: string;
  order_code: string;
  total_amount: number;
  shipping_fee: number;
  message?: string;
};

type CheckoutQuote = {
  ok: true;
  subtotal: number;
  shipping_fee: number;
  total_amount: number;
};

type QuoteSnapshot = { key: string; data: CheckoutQuote };
type CheckoutAttempt = { fingerprint: string; ref: string };
const CHECKOUT_ATTEMPT_KEY = "rungu-checkout-attempt";

async function requestQuote(items: Array<{ variant_id: number; quantity: number }>, paymentMethod: string, signal?: AbortSignal): Promise<CheckoutQuote> {
  const response = await fetch("/api/checkout/quote", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ items, payment_method: paymentMethod }),
    signal,
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok || !payload?.ok) {
    throw new Error(payload?.error || "Không kiểm tra được giá và tồn kho. Vui lòng thử lại.");
  }
  if (![payload.subtotal, payload.shipping_fee, payload.total_amount].every((value) => Number.isSafeInteger(value) && value >= 0)) {
    throw new Error("Hệ thống đặt hàng trả về số tiền không hợp lệ.");
  }
  return payload as CheckoutQuote;
}

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
  const configuredBank = storefrontContent.sales.bank_transfer?.bank;
  const bank = configuredBank
    && /^[A-Za-z0-9]+$/.test(configuredBank.code)
    && /^[0-9]+$/.test(configuredBank.account_number)
    && configuredBank.account_name.trim()
    ? configuredBank
    : null;
  const enabledMethods = useMemo(
    () => Object.entries(storefrontContent.sales).filter(([key, config]) =>
      config.enabled && (key !== "bank_transfer" || Boolean(bank)),
    ),
    [storefrontContent.sales, bank],
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
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [quote, setQuote] = useState<QuoteSnapshot | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState("");
  const checkoutAttempt = useRef<CheckoutAttempt | null>(null);

  const orderItems = useMemo(
    () => cart.map((item) => ({ variant_id: Number(item.variantId), quantity: item.qty })),
    [cart],
  );
  const quoteKey = JSON.stringify([form.payment_method, orderItems]);
  const validVariants = cart.length > 0 && orderItems.every((item) =>
    Number.isSafeInteger(item.variant_id) && item.variant_id > 0
      && Number.isInteger(item.quantity) && item.quantity > 0 && item.quantity <= 100,
  );
  const currentQuote = quote?.key === quoteKey ? quote.data : null;

  const getCheckoutRef = (fingerprint: string) => {
    let previous = checkoutAttempt.current;
    if (!previous) {
      try {
        previous = JSON.parse(window.sessionStorage.getItem(CHECKOUT_ATTEMPT_KEY) || "null") as CheckoutAttempt | null;
      } catch {
        previous = null;
      }
    }
    if (previous?.fingerprint === fingerprint && typeof previous.ref === "string") {
      checkoutAttempt.current = previous;
      return previous.ref;
    }

    const attempt = { fingerprint, ref: window.crypto.randomUUID() };
    checkoutAttempt.current = attempt;
    try {
      window.sessionStorage.setItem(CHECKOUT_ATTEMPT_KEY, JSON.stringify(attempt));
    } catch {
      // The in-memory ref still keeps retries in this tab idempotent.
    }
    return attempt.ref;
  };

  useEffect(() => {
    if (!checkoutMode || result) return;
    if (!validVariants) {
      setQuote(null);
      setQuoteError("Giỏ hàng có sản phẩm không còn hợp lệ. Vui lòng xóa và thêm lại từ trang sản phẩm.");
      return;
    }

    const controller = new AbortController();
    setQuote(null);
    setQuoteLoading(true);
    setQuoteError("");
    requestQuote(orderItems, form.payment_method, controller.signal)
      .then((data) => setQuote({ key: quoteKey, data }))
      .catch((quoteFailure) => {
        if (!controller.signal.aborted) {
          setQuoteError(quoteFailure instanceof Error ? quoteFailure.message : "Không kiểm tra được đơn hàng.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setQuoteLoading(false);
      });
    return () => controller.abort();
  }, [checkoutMode, result, validVariants, quoteKey, orderItems, form.payment_method]);

  useEffect(() => {
    if (!result?.checkout_ref || form.payment_method !== "bank_transfer" || paymentConfirmed) return;
    let stopped = false;
    const check = async () => {
      try {
        const response = await fetch(`/api/checkout/status/${result.checkout_ref}`, { cache: "no-store" });
        const status = await response.json();
        if (!stopped && response.ok && status.order_code === result.order_code && status.pay_status === 1) {
          setPaymentConfirmed(true);
        }
      } catch { /* Keep the pending state until the next check. */ }
    };
    void check();
    const timer = window.setInterval(check, 5000);
    return () => { stopped = true; window.clearInterval(timer); };
  }, [result, form.payment_method, paymentConfirmed]);

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
      setQuoteError("");
      setQuote(null);
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

    if (!enabledMethods.some(([key]) => key === form.payment_method)) {
      setError("Hình thức thanh toán này chưa sẵn sàng. Vui lòng chọn cách thanh toán khác.");
      return;
    }

    if (!validVariants || !currentQuote || quoteLoading) {
      setError("Đang kiểm tra giá và tồn kho. Vui lòng chờ rồi xác nhận lại.");
      return;
    }

    setSubmitting(true);
    try {
      // Recheck immediately before creating the order. If anything changed, ask
      // the customer to review the new amount rather than silently charging it.
      const latestQuote = await requestQuote(orderItems, form.payment_method);
      if (latestQuote.subtotal !== currentQuote.subtotal
        || latestQuote.shipping_fee !== currentQuote.shipping_fee
        || latestQuote.total_amount !== currentQuote.total_amount) {
        setQuote({ key: quoteKey, data: latestQuote });
        setError("Giá hoặc phí giao hàng vừa thay đổi. Vui lòng kiểm tra tổng tiền mới và xác nhận lại.");
        return;
      }

      const checkoutDetails = {
        customer_name: form.customer_name.trim(),
        customer_phone: form.customer_phone.trim(),
        customer_email: form.customer_email.trim() || null,
        province: form.province.trim(),
        ward: form.ward.trim(),
        address: form.address.trim(),
        note: form.note.trim() || null,
        payment_method: form.payment_method,
        expected_total_amount: currentQuote.total_amount,
        items: orderItems,
      };
      const checkoutRef = getCheckoutRef(JSON.stringify(checkoutDetails));
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...checkoutDetails, checkout_ref: checkoutRef }),
      });
      const payload = await response.json();

      if (!response.ok || !payload.success) {
        const validationMessage = payload.errors
          ? Object.values(payload.errors).flat().join(" ")
          : null;
        throw new Error(validationMessage || payload.error || "Không thể tạo đơn hàng.");
      }

      setPaymentConfirmed(Number(payload.pay_status) === 1);
      setResult({
        checkout_ref: checkoutRef,
        order_code: payload.order_code,
        total_amount: Number(payload.total_amount),
        shipping_fee: Number(payload.shipping_fee),
        message: payload.message,
      });
      checkoutAttempt.current = null;
      try {
        window.sessionStorage.removeItem(CHECKOUT_ATTEMPT_KEY);
      } catch {
        // Session storage may be unavailable in private browsing.
      }
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

            {form.payment_method === "bank_transfer" && bank ? (
              <div className="mt-6 border border-forest-800/15 bg-[#faf8f4] p-4 text-left">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-forest-900 mb-3">
                  <span>Thông tin chuyển khoản</span>
                </div>

                <div className="space-y-2 text-xs text-forest-800">
                    <div>
                      <span className="text-[11px] text-forest-500 block">Ngân hàng</span>
                      <strong className="text-forest-900">{bank.code}</strong>
                    </div>

                    <div>
                      <span className="text-[11px] text-forest-500 block">Số tài khoản</span>
                      <div className="flex items-center gap-2">
                        <strong className="font-mono text-forest-900">{bank.account_number}</strong>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(bank.account_number, "stk")}
                          className="inline-flex items-center gap-1 rounded bg-white px-2 py-0.5 text-[10px] border border-forest-800/20 text-forest-700 hover:text-forest-950"
                        >
                          {copiedField === "stk" ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
                          <span>{copiedField === "stk" ? "Đã chép" : "Sao chép"}</span>
                        </button>
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] text-forest-500 block">Chủ tài khoản</span>
                      <strong className="text-forest-900">{bank.account_name}</strong>
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

                <p className="mt-3 text-[11px] text-forest-600 border-t border-forest-800/10 pt-2.5">
                  {paymentConfirmed
                    ? "SePay đã xác nhận chuyển khoản. Cửa hàng sẽ xử lý đơn hàng của bạn."
                    : "Đang chờ SePay xác nhận chuyển khoản. Vui lòng chuyển đúng số tiền và nội dung mã đơn; giữ lại biên lai để được hỗ trợ khi cần."}
                </p>
              </div>
            ) : (
              <div className="mt-6 border border-forest-800/15 bg-[#faf8f4] p-4 text-left text-xs space-y-2">
                <div className="flex items-center gap-2 font-semibold uppercase tracking-wider text-forest-900">
                  <Truck className="h-4 w-4 text-[#8d693a]" />
                  <span>Hình thức: Thanh toán khi nhận hàng (COD)</span>
                </div>
                <p className="text-forest-700 leading-relaxed">Cửa hàng sẽ xác nhận đơn trước khi giao. Bạn thanh toán khi nhận hàng.</p>
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

              {enabledMethods.length === 0 && <p role="alert" className="border border-red-200 bg-red-50 p-3 text-xs text-red-700">Chưa có hình thức thanh toán nào sẵn sàng. Vui lòng liên hệ cửa hàng.</p>}
              {quoteLoading && <p className="text-xs text-forest-600">Đang kiểm tra giá và tồn kho mới nhất...</p>}
              {quoteError && <p role="alert" className="border border-red-200 bg-red-50 p-3 text-xs leading-5 text-red-700">{quoteError}</p>}
              {error && <p role="alert" className="border border-red-200 bg-red-50 p-3 text-xs leading-5 text-red-700">{error}</p>}
            </div>

            <div className="space-y-3 border-t border-forest-800/10 pt-4">
              <Summary subtotal={currentQuote?.subtotal ?? cartTotal} shipping={currentQuote?.shipping_fee ?? estimatedShipping} total={currentQuote?.total_amount ?? grandTotal} />
              {!currentQuote && <p className="text-[11px] text-forest-600">Tổng tiền trên chỉ là dự kiến; chờ xác nhận từ hệ thống quản lý trước khi đặt hàng.</p>}
              <button type="submit" disabled={submitting || quoteLoading || !currentQuote || enabledMethods.length === 0} className="w-full bg-forest-800 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-white disabled:cursor-not-allowed disabled:opacity-50">
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
