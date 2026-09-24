"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useCart } from "@/lib/CartContext";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock3,
  Copy,
  CreditCard,
  MapPin,
  QrCode,
  ShieldCheck,
  ShoppingBag,
  Tag,
  Ticket,
  Trash2,
  Truck,
  X,
} from "lucide-react";

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
  discount: number;
  shipping_fee: number;
  total_amount: number;
};

type QuoteSnapshot = { key: string; data: CheckoutQuote };
type CheckoutAttempt = { fingerprint: string; ref: string };
const CHECKOUT_ATTEMPT_KEY = "rungu-checkout-attempt";

async function requestQuote(
  items: Array<{ variant_id: number; quantity: number }>,
  paymentMethod: string,
  voucherCode = "",
  signal?: AbortSignal,
): Promise<CheckoutQuote> {
  const response = await fetch("/api/checkout/quote", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ items, payment_method: paymentMethod, voucher_code: voucherCode || null }),
    signal,
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok || !payload?.ok) {
    throw new Error(payload?.error || "Không kiểm tra được giá và tồn kho. Vui lòng thử lại.");
  }
  if (![payload.subtotal, payload.discount, payload.shipping_fee, payload.total_amount].every((value) => Number.isSafeInteger(value) && value >= 0)) {
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
  cod: "Thanh toán khi nhận hàng (COD)",
  bank_transfer: "Chuyển khoản ngân hàng (VietQR)",
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
  const [showOrderReview, setShowOrderReview] = useState(false);
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
  const [voucherCode, setVoucherCode] = useState("");
  const [appliedVoucherCode, setAppliedVoucherCode] = useState("");
  const [voucherRefresh, setVoucherRefresh] = useState(0);
  const bankQrUrl = result && form.payment_method === "bank_transfer"
    ? `/api/checkout/qr/${encodeURIComponent(result.checkout_ref)}`
    : null;
  const checkoutAttempt = useRef<CheckoutAttempt | null>(null);

  const orderItems = useMemo(
    () => cart.map((item) => ({ variant_id: Number(item.variantId), quantity: item.qty })),
    [cart],
  );
  const quoteKey = JSON.stringify([form.payment_method, orderItems, appliedVoucherCode]);
  const validVariants = cart.length > 0 && orderItems.every((item) =>
    Number.isSafeInteger(item.variant_id) && item.variant_id > 0
      && Number.isInteger(item.quantity) && item.quantity > 0 && item.quantity <= 100,
  );
  const currentQuote = quote?.key === quoteKey ? quote.data : null;
  // Keep showing the last quote while a payment-method change is being
  // recalculated. The submit button remains disabled until the new quote
  // arrives, but the applied voucher should not appear to disappear.
  const displayedQuote = currentQuote ?? (appliedVoucherCode && quote ? quote.data : null);

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
    requestQuote(orderItems, form.payment_method, appliedVoucherCode, controller.signal)
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
  }, [checkoutMode, result, validVariants, quoteKey, orderItems, form.payment_method, appliedVoucherCode, voucherRefresh]);

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
      setShowOrderReview(false);
      setError("");
      setQuoteError("");
      setQuote(null);
      setVoucherCode("");
      setAppliedVoucherCode("");
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

  const applyVoucher = () => {
    const normalized = voucherCode.trim().toUpperCase();
    if (normalized && !/^[A-Z0-9_-]{1,50}$/.test(normalized)) {
      setQuoteError("Mã giảm giá chỉ gồm chữ cái, số, dấu gạch ngang hoặc gạch dưới.");
      return;
    }
    setVoucherCode(normalized);
    setQuote(null);
    setQuoteError("");
    setAppliedVoucherCode(normalized);
    setVoucherRefresh((current) => current + 1);
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
      const latestQuote = await requestQuote(orderItems, form.payment_method, appliedVoucherCode);
      if (latestQuote.subtotal !== currentQuote.subtotal
        || latestQuote.discount !== currentQuote.discount
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
        voucher_code: appliedVoucherCode || null,
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
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/75 backdrop-blur-xs transition-opacity duration-300 pointer-events-auto ${isCartOpen ? "opacity-100" : "opacity-0 hidden"}`}
        onClick={closeDrawer}
      />

      {/* Main Drawer Shell */}
      <div
        className={`absolute top-0 right-0 bottom-0 w-full max-w-full sm:max-w-xl md:max-w-2xl bg-white border-l border-forest-800/15 p-4 sm:p-6 md:p-8 flex flex-col font-ui transform transition-transform duration-300 ease-out pointer-events-auto shadow-2xl ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-forest-800/10 pb-3 sm:pb-4">
          <div className="flex items-center gap-2.5">
            {checkoutMode && !result ? (
              <button
                type="button"
                onClick={() => setCheckoutMode(false)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-forest-800/20 bg-forest-50/80 px-2.5 py-1.5 text-xs font-bold text-forest-800 hover:bg-forest-100 transition-colors"
                aria-label="Quay lại giỏ hàng"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden xs:inline sm:inline">Giỏ hàng</span>
              </button>
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-forest-50 text-forest-800 border border-forest-800/10">
                <ShoppingBag className="h-4.5 w-4.5" />
              </div>
            )}
            <span className="font-serif text-2xl sm:text-3xl text-forest-950 font-medium tracking-wide">
              {result
                ? (form.payment_method === "bank_transfer" && !paymentConfirmed ? "Chờ thanh toán" : "Đặt hàng thành công")
                : checkoutMode ? "Thông tin đặt hàng" : "Giỏ hàng"}
            </span>
            {!checkoutMode && !result && (
              <span className="rounded-full bg-forest-100 px-2.5 py-0.5 text-xs font-bold text-forest-800">
                {itemCount}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={closeDrawer}
            className="flex h-9 w-9 items-center justify-center rounded-full text-forest-700 hover:bg-forest-100 hover:text-forest-950 transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* View 1: Success / Result Screen */}
        {result ? (
          <div className="flex flex-1 flex-col overflow-y-auto py-5 sm:py-6 px-1">
            <div className="text-center bg-forest-50/70 border border-forest-800/15 rounded-2xl p-5 sm:p-6 shadow-xs">
              <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${form.payment_method === "bank_transfer" && !paymentConfirmed ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-700"}`}>
                {form.payment_method === "bank_transfer" && !paymentConfirmed
                  ? <Clock3 className="h-8 w-8" strokeWidth={2} />
                  : <CheckCircle2 className="h-8 w-8" strokeWidth={2} />}
              </div>
              <h3 className="mt-3 font-serif text-2xl sm:text-3xl text-forest-950 font-medium">
                {form.payment_method === "bank_transfer" && !paymentConfirmed
                  ? "Đơn hàng đang chờ thanh toán"
                  : "RUNGU đã nhận đơn của bạn!"}
              </h3>
              <p className="mt-1 text-sm text-forest-700">
                {form.payment_method === "bank_transfer" && !paymentConfirmed
                  ? "Đơn đã được tạo và giữ hàng. Vui lòng quét mã QR hoặc chuyển khoản để hoàn tất."
                  : "Cảm ơn bạn đã lựa chọn những nốt hương an lành từ thiên nhiên."}
              </p>

              <div className="mt-4 inline-flex flex-wrap items-center justify-center gap-2 sm:gap-4 rounded-xl bg-white border border-forest-800/15 px-4 py-2.5 shadow-xs">
                <div className="text-left">
                  <span className="text-xs font-medium text-forest-600 block">Mã đơn hàng</span>
                  <strong className="font-mono text-base font-bold text-forest-950">{result.order_code}</strong>
                </div>
                <div className="h-8 w-px bg-forest-800/10 hidden sm:block" />
                <div className="text-left">
                  <span className="text-xs font-medium text-forest-600 block">Tổng thanh toán</span>
                  <strong className="font-serif text-lg font-bold text-amberWood-dark">
                    {result.total_amount.toLocaleString("vi-VN")} đ
                  </strong>
                </div>
              </div>
            </div>

            {form.payment_method === "bank_transfer" && bank ? (
              <div className="mt-5 rounded-2xl border border-forest-800/20 bg-[#faf8f4] p-4 sm:p-6 text-left shadow-xs">
                <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-forest-950 mb-3 border-b border-forest-800/10 pb-2.5">
                  <Building2 className="h-4 w-4 text-amberWood-dark" />
                  <span>Thông tin chuyển khoản ngân hàng</span>
                </div>

                <div className="space-y-3 text-sm text-forest-800">
                  <div className="flex justify-between items-center py-1 border-b border-forest-800/5">
                    <span className="text-xs sm:text-sm font-medium text-forest-600">Ngân hàng</span>
                    <strong className="text-sm sm:text-base font-bold text-forest-950">{bank.code}</strong>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-forest-800/5">
                    <span className="text-xs sm:text-sm font-medium text-forest-600">Số tài khoản</span>
                    <div className="flex items-center gap-2">
                      <strong className="font-mono text-base font-bold text-forest-950">{bank.account_number}</strong>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(bank.account_number, "stk")}
                        className="inline-flex items-center gap-1 rounded-md bg-white px-2.5 py-1 text-xs font-bold border border-forest-800/20 text-forest-800 hover:bg-forest-100 hover:text-forest-950 transition-colors shadow-2xs cursor-pointer"
                      >
                        {copiedField === "stk" ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                        <span>{copiedField === "stk" ? "Đã chép" : "Sao chép"}</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-forest-800/5">
                    <span className="text-xs sm:text-sm font-medium text-forest-600">Chủ tài khoản</span>
                    <strong className="text-sm sm:text-base font-bold text-forest-950 uppercase">{bank.account_name}</strong>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-forest-800/5">
                    <span className="text-xs sm:text-sm font-medium text-forest-600">Số tiền</span>
                    <strong className="font-serif text-base sm:text-lg font-bold text-amberWood-dark">
                      {result.total_amount.toLocaleString("vi-VN")} đ
                    </strong>
                  </div>

                  <div className="flex justify-between items-center py-1">
                    <span className="text-xs sm:text-sm font-medium text-forest-600">Nội dung chuyển khoản</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-base font-bold rounded-md bg-amber-100/80 border border-amber-300/80 px-2 py-0.5 text-amber-950">
                        {result.order_code}
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(result.order_code, "code")}
                        className="inline-flex items-center gap-1 rounded-md bg-white px-2.5 py-1 text-xs font-bold border border-forest-800/20 text-forest-800 hover:bg-forest-100 hover:text-forest-950 transition-colors shadow-2xs cursor-pointer"
                      >
                        {copiedField === "code" ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                        <span>{copiedField === "code" ? "Đã chép" : "Sao chép"}</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-xl bg-forest-100/70 border border-forest-800/10 p-3 text-xs leading-relaxed text-forest-800 flex items-start gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
                  <p>
                    {paymentConfirmed
                      ? "SePay đã tự động xác nhận chuyển khoản thành công. Cửa hàng đang chuẩn bị đơn hàng của bạn!"
                      : "Hệ thống SePay tự động kiểm tra chuyển khoản. Vui lòng chuyển chính xác số tiền và nội dung mã đơn để đơn hàng được duyệt tự động ngay lập tức."}
                  </p>
                </div>

                {bankQrUrl && (
                  <div className="mt-5 border-t border-forest-800/10 pt-4 text-center">
                    <div className="inline-flex items-center gap-1.5 text-sm font-bold text-forest-950 mb-2">
                      <QrCode className="h-4 w-4 text-amberWood-dark" />
                      <span>Quét mã VietQR để thanh toán nhanh</span>
                    </div>
                    <div className="mx-auto mt-2 inline-block rounded-2xl border-2 border-forest-800/15 bg-white p-3 shadow-md">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={bankQrUrl}
                        alt={`Mã QR chuyển khoản cho đơn ${result.order_code}`}
                        className="h-52 w-52 sm:h-60 sm:w-60 object-contain mx-auto"
                      />
                    </div>
                    <p className="mt-3 text-xs text-forest-600">
                      Mở app ngân hàng bất kỳ &gt; Quét QR &gt; Nội dung mã đơn: <strong className="font-mono text-forest-950">{result.order_code}</strong>
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-5 rounded-2xl border border-forest-800/15 bg-[#faf8f4] p-5 text-left text-sm space-y-2.5 shadow-xs">
                <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-forest-950">
                  <Truck className="h-5 w-5 text-amberWood-dark" />
                  <span>Hình thức: Thanh toán khi nhận hàng (COD)</span>
                </div>
                <p className="text-forest-800 leading-relaxed">
                  Cửa hàng sẽ liên hệ với bạn theo số điện thoại đã cung cấp để xác nhận đơn hàng trước khi gửi. Bạn có thể kiểm tra sản phẩm và thanh toán tiền mặt khi nhận hàng.
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={closeDrawer}
              className="mt-6 w-full rounded-xl bg-forest-900 py-4 text-sm font-bold uppercase tracking-wider text-white hover:bg-forest-950 transition-colors shadow-md cursor-pointer"
            >
              Tiếp tục mua sắm
            </button>
          </div>
        ) : checkoutMode ? (
          /* View 2: Checkout Form */
          <form onSubmit={submitOrder} className="flex min-h-0 flex-1 flex-col">
            <div className="flex-1 space-y-4 sm:space-y-5 overflow-y-auto py-4 sm:py-5 pr-1">
              {/* Collapsible Order Review */}
              <div className="rounded-xl border border-forest-800/15 bg-forest-50/60 p-3 sm:p-3.5 transition-all">
                <button
                  type="button"
                  onClick={() => setShowOrderReview(!showOrderReview)}
                  className="flex w-full items-center justify-between text-left cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4 text-forest-700" />
                    <span className="text-sm font-bold text-forest-950">
                      Xem lại đơn hàng ({itemCount} sản phẩm)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-forest-950">
                      {cartTotal.toLocaleString("vi-VN")} đ
                    </span>
                    {showOrderReview ? (
                      <ChevronUp className="h-4 w-4 text-forest-600" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-forest-600" />
                    )}
                  </div>
                </button>

                {showOrderReview && (
                  <div className="mt-3 space-y-2.5 border-t border-forest-800/10 pt-3 max-h-56 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.cartKey} className="flex items-center gap-3 text-xs">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-11 w-11 rounded-md object-cover border border-forest-800/10 shrink-0 bg-white"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="truncate font-semibold text-forest-950 text-xs sm:text-sm">{item.name}</p>
                          <p className="text-[11px] text-forest-600">{item.variantLabel} × {item.qty}</p>
                        </div>
                        <span className="font-semibold text-forest-900 shrink-0">
                          {(item.price * item.qty).toLocaleString("vi-VN")} đ
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Step 1: Customer Delivery Information */}
              <div className="space-y-4 rounded-xl border border-forest-800/15 bg-white p-4 sm:p-5 shadow-xs">
                <div className="flex items-center gap-2 border-b border-forest-800/10 pb-3">
                  <MapPin className="h-4 w-4 text-amberWood-dark" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-forest-950">
                    1. Thông tin giao hàng
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                  <Field
                    label="Họ và tên người nhận"
                    required
                    placeholder="Ví dụ: Nguyễn Văn An"
                    autoComplete="name"
                    value={form.customer_name}
                    onChange={(value) => setForm({ ...form, customer_name: value })}
                  />
                  <Field
                    label="Số điện thoại"
                    required
                    type="tel"
                    inputMode="tel"
                    placeholder="Ví dụ: 0912 345 678"
                    autoComplete="tel"
                    value={form.customer_phone}
                    onChange={(value) => setForm({ ...form, customer_phone: value })}
                  />
                </div>

                <Field
                  label="Email nhận thông báo"
                  type="email"
                  inputMode="email"
                  optional
                  placeholder="Ví dụ: name@example.com (không bắt buộc)"
                  autoComplete="email"
                  value={form.customer_email}
                  onChange={(value) => setForm({ ...form, customer_email: value })}
                />

                <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                  <Field
                    label="Tỉnh / Thành phố"
                    required
                    placeholder="Ví dụ: Hà Nội, TP. HCM..."
                    autoComplete="address-level1"
                    value={form.province}
                    onChange={(value) => setForm({ ...form, province: value })}
                  />
                  <Field
                    label="Phường / Xã (hoặc Quận / Huyện)"
                    required
                    placeholder="Ví dụ: Phường Bến Nghé, Quận 1"
                    autoComplete="address-level2"
                    value={form.ward}
                    onChange={(value) => setForm({ ...form, ward: value })}
                  />
                </div>

                <Field
                  label="Địa chỉ cụ thể (Số nhà, tên đường)"
                  required
                  placeholder="Ví dụ: Số 24 ngõ 12 phố Tràng Tiền"
                  autoComplete="street-address"
                  value={form.address}
                  onChange={(value) => setForm({ ...form, address: value })}
                />

                <div>
                  <label className="block text-sm font-bold text-forest-950 mb-1.5">
                    Ghi chú đơn hàng <span className="text-xs font-normal text-forest-600">(không bắt buộc)</span>
                  </label>
                  <textarea
                    value={form.note}
                    onChange={(event) => setForm({ ...form, note: event.target.value })}
                    rows={3}
                    placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi đến, gửi bảo vệ..."
                    className="w-full rounded-xl border border-forest-800/25 bg-white p-3.5 text-base text-forest-950 placeholder:text-forest-400 placeholder:text-sm focus:border-forest-900 focus:ring-2 focus:ring-forest-800/20 focus:outline-none transition-all shadow-xs"
                  />
                </div>
              </div>

              {/* Step 2: Voucher Section */}
              <div className="rounded-xl border border-forest-800/15 bg-forest-50/70 p-4 sm:p-5 shadow-xs">
                <div className="flex items-center gap-2 mb-3">
                  <Ticket className="h-4 w-4 text-amberWood-dark" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-forest-950">
                    2. Mã giảm giá (Voucher)
                  </h3>
                </div>

                <div className="flex gap-2">
                  <input
                    value={voucherCode}
                    onChange={(event) => setVoucherCode(event.target.value.toUpperCase())}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        applyVoucher();
                      }
                    }}
                    maxLength={50}
                    placeholder="Nhập mã ưu đãi (nếu có)"
                    aria-label="Mã giảm giá"
                    className="flex-1 rounded-xl border border-forest-800/25 bg-white px-3.5 py-2.5 text-base font-semibold uppercase tracking-wider text-forest-950 placeholder:normal-case placeholder:font-normal placeholder:tracking-normal placeholder:text-forest-400 focus:border-forest-900 focus:ring-2 focus:ring-forest-800/20 focus:outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={applyVoucher}
                    className="rounded-xl bg-forest-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-forest-950 transition-colors shadow-xs shrink-0 cursor-pointer"
                  >
                    Áp dụng
                  </button>
                </div>

                {appliedVoucherCode && (
                  <div className="mt-3 flex items-center justify-between rounded-xl bg-emerald-50 border border-emerald-200/80 px-3.5 py-2.5 text-sm text-emerald-900" role="status">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-emerald-700 shrink-0" />
                      <span>
                        Đã áp dụng mã: <strong className="font-bold text-emerald-950">{appliedVoucherCode}</strong>
                        {!currentQuote && " (đang cập nhật...)"}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setVoucherCode("");
                        setAppliedVoucherCode("");
                        setVoucherRefresh((current) => current + 1);
                      }}
                      className="text-xs font-bold text-red-600 hover:text-red-700 underline underline-offset-2 ml-2 cursor-pointer"
                    >
                      Bỏ mã
                    </button>
                  </div>
                )}
              </div>

              {/* Step 3: Payment Method Selection */}
              <div className="space-y-3 rounded-xl border border-forest-800/15 bg-white p-4 sm:p-5 shadow-xs">
                <div className="flex items-center gap-2 border-b border-forest-800/10 pb-3">
                  <CreditCard className="h-4 w-4 text-amberWood-dark" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-forest-950">
                    3. Hình thức thanh toán
                  </h3>
                </div>

                <div className="space-y-2.5">
                  {enabledMethods.map(([key]) => {
                    const isSelected = form.payment_method === key;
                    const isCOD = key === "cod";
                    const isBank = key === "bank_transfer";

                    return (
                      <label
                        key={key}
                        className={`flex cursor-pointer items-start gap-3.5 rounded-xl border p-3.5 sm:p-4 transition-all ${
                          isSelected
                            ? "border-forest-900 bg-forest-50/90 ring-2 ring-forest-900/15 shadow-sm"
                            : "border-forest-800/20 bg-white hover:border-forest-800/40 hover:bg-forest-50/30"
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment_method"
                          value={key}
                          checked={isSelected}
                          onChange={() => setForm((current) => ({ ...current, payment_method: key }))}
                          className="mt-1 h-4 w-4 text-forest-900 accent-forest-900 focus:ring-forest-800"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            {isCOD ? (
                              <Truck className="h-4 w-4 text-amberWood-dark shrink-0" />
                            ) : isBank ? (
                              <QrCode className="h-4 w-4 text-amberWood-dark shrink-0" />
                            ) : null}
                            <span className="text-sm sm:text-base font-bold text-forest-950">
                              {paymentLabels[key] ?? key}
                            </span>
                            {isBank && (
                              <span className="rounded bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800">
                                VietQR Tự động
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-xs sm:text-sm text-forest-700 leading-relaxed">
                            {isCOD
                              ? "Nhận hàng, kiểm tra sản phẩm trước khi thanh toán tiền mặt cho nhân viên giao hàng."
                              : isBank
                              ? "Quét mã VietQR tiện lợi qua ứng dụng mọi ngân hàng. Xác nhận thanh toán tự động."
                              : "Thanh toán cho đơn hàng."}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Status and Error Alerts */}
              {enabledMethods.length === 0 && (
                <div role="alert" className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800">
                  <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                  <p>Chưa có hình thức thanh toán nào sẵn sàng. Vui lòng liên hệ với cửa hàng để được hỗ trợ.</p>
                </div>
              )}

              {quoteLoading && (
                <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-forest-800 bg-forest-50 p-3 rounded-xl border border-forest-800/10">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-forest-700 border-t-transparent shrink-0" />
                  <span>Đang tính toán lại khuyến mãi và phí vận chuyển...</span>
                </div>
              )}

              {quoteError && (
                <div role="alert" className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm font-medium text-red-800">
                  <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                  <p>{quoteError}</p>
                </div>
              )}

              {error && (
                <div role="alert" className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm font-medium text-red-800">
                  <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}
            </div>

            {/* Bottom Actions & Summary Bar */}
            <div className="space-y-3.5 border-t border-forest-800/15 bg-white pt-4">
              <Summary
                subtotal={displayedQuote?.subtotal ?? cartTotal}
                discount={displayedQuote?.discount ?? 0}
                shipping={displayedQuote?.shipping_fee ?? estimatedShipping}
                total={displayedQuote?.total_amount ?? grandTotal}
              />

              {!currentQuote && (
                <p className="text-xs text-forest-600 text-center">
                  Tổng tiền trên là dự kiến; hệ thống đang kiểm tra tồn kho trước khi đặt hàng.
                </p>
              )}

              <button
                type="submit"
                disabled={submitting || quoteLoading || !currentQuote || enabledMethods.length === 0}
                className="h-13 sm:h-14 w-full rounded-xl bg-forest-900 hover:bg-forest-950 active:scale-[0.99] text-white font-bold text-base sm:text-lg tracking-wide shadow-md transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Đang xử lý đơn hàng...</span>
                  </>
                ) : (
                  <>
                    <span>Xác nhận đặt hàng</span>
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-xs text-forest-600">
                <ShieldCheck className="h-4 w-4 text-emerald-700" />
                <span>Bảo mật thông tin khách hàng &amp; kiểm tra hàng trước khi nhận</span>
              </div>
            </div>
          </form>
        ) : (
          /* View 3: Cart Items View */
          <>
            <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-1">
              {cart.length === 0 ? (
                <div className="py-20 text-center">
                  <ShoppingBag className="mx-auto h-14 w-14 text-forest-400" strokeWidth={1.2} />
                  <h4 className="mt-4 font-serif text-xl font-medium text-forest-900">Giỏ hàng của bạn đang trống</h4>
                  <p className="mt-1 text-sm text-forest-600">Hãy dạo một vòng và chọn cho mình nốt hương yêu thích nhé.</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.cartKey}
                    className="flex items-center gap-3.5 rounded-xl border border-forest-800/15 bg-white p-3.5 shadow-xs transition-shadow hover:shadow-sm"
                  >
                    <div className="h-18 w-18 flex-shrink-0 overflow-hidden rounded-lg bg-forest-50 border border-forest-800/10">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="truncate font-serif text-base font-semibold text-forest-950">{item.name}</h4>
                      <span className="mt-0.5 block truncate text-xs text-forest-600">{item.variantLabel}</span>
                      <span className="mt-1 block text-sm font-bold text-forest-900">{item.price.toLocaleString("vi-VN")} đ</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center rounded-lg border border-forest-800/20 bg-forest-50/70">
                        <button
                          type="button"
                          onClick={() => changeQty(item.cartKey, -1)}
                          className="h-8 w-8 text-sm font-bold text-forest-800 hover:bg-forest-100 flex items-center justify-center transition-colors cursor-pointer"
                          aria-label="Giảm số lượng"
                        >
                          −
                        </button>
                        <span className="w-7 text-center text-xs font-bold text-forest-950">{item.qty}</span>
                        <button
                          type="button"
                          onClick={() => changeQty(item.cartKey, 1)}
                          className="h-8 w-8 text-sm font-bold text-forest-800 hover:bg-forest-100 flex items-center justify-center transition-colors cursor-pointer"
                          aria-label="Tăng số lượng"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => changeQty(item.cartKey, -item.qty)}
                        className="rounded-lg p-2 text-forest-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        aria-label={`Xóa ${item.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="space-y-4 border-t border-forest-800/15 bg-white pt-4">
                <div className="flex items-center gap-2.5 rounded-xl bg-forest-50 border border-forest-800/10 p-3 text-xs font-medium text-forest-800">
                  <Truck className="h-4 w-4 text-amberWood-dark shrink-0" />
                  <span>
                    {estimatedShipping === 0
                      ? "Đơn hàng của bạn được miễn phí vận chuyển toàn quốc!"
                      : `Phí vận chuyển dự kiến: ${estimatedShipping.toLocaleString("vi-VN")} đ`}
                  </span>
                </div>

                <Summary subtotal={cartTotal} discount={0} shipping={estimatedShipping} total={grandTotal} />

                <button
                  type="button"
                  onClick={() => {
                    setCheckoutMode(true);
                    setError("");
                  }}
                  className="flex h-13 sm:h-14 w-full items-center justify-center gap-2.5 rounded-xl bg-forest-900 hover:bg-forest-950 active:scale-[0.99] text-base font-bold tracking-wide text-white shadow-md transition-all cursor-pointer"
                >
                  <span>Tiến hành đặt hàng</span>
                  <ArrowRight className="h-5 w-5" />
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
  optional = false,
  type = "text",
  inputMode,
  placeholder,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  optional?: boolean;
  type?: string;
  inputMode?: "text" | "tel" | "email" | "numeric";
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-bold text-forest-950 mb-1.5">
        {label}
        {required && <span className="text-red-600 font-bold ml-1">*</span>}
        {optional && <span className="text-xs font-normal text-forest-600 ml-1.5">(Không bắt buộc)</span>}
      </label>
      <input
        type={type}
        inputMode={inputMode}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 sm:h-12.5 w-full rounded-xl border border-forest-800/25 bg-white px-3.5 text-base font-normal text-forest-950 placeholder:text-forest-400 placeholder:text-sm focus:border-forest-900 focus:ring-2 focus:ring-forest-800/20 focus:outline-none transition-all shadow-xs"
      />
    </div>
  );
}

function Summary({
  subtotal,
  discount,
  shipping,
  total,
}: {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
}) {
  return (
    <div className="rounded-xl bg-forest-50/80 border border-forest-800/15 p-4 space-y-2.5 text-sm">
      <div className="flex justify-between items-center text-forest-700">
        <span className="font-medium">Tạm tính ({subtotal > 0 ? "sản phẩm" : ""})</span>
        <span className="font-semibold text-forest-950">{subtotal.toLocaleString("vi-VN")} đ</span>
      </div>
      {discount > 0 && (
        <div className="flex justify-between items-center text-emerald-800 font-medium">
          <span>Giảm giá khuyến mãi</span>
          <span className="font-bold">−{discount.toLocaleString("vi-VN")} đ</span>
        </div>
      )}
      <div className="flex justify-between items-center text-forest-700">
        <span className="font-medium">Phí vận chuyển</span>
        <span className="font-semibold text-forest-950">
          {shipping === 0 ? (
            <span className="text-emerald-700 font-bold bg-emerald-100/80 px-2 py-0.5 rounded text-xs">
              Miễn phí giao hàng
            </span>
          ) : (
            `${shipping.toLocaleString("vi-VN")} đ`
          )}
        </span>
      </div>
      <div className="border-t border-forest-800/15 pt-3 flex justify-between items-baseline">
        <div>
          <span className="block text-base font-bold text-forest-950">Tổng thanh toán</span>
          <span className="text-[11px] text-forest-600 font-normal">Đã bao gồm VAT &amp; các loại phí</span>
        </div>
        <span className="font-serif text-2xl sm:text-3xl font-bold text-forest-950">
          {total.toLocaleString("vi-VN")} đ
        </span>
      </div>
    </div>
  );
}
