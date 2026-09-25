"use client";

import { FormEvent, Suspense, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  Download,
  Lock,
  MapPin,
  QrCode,
  RotateCcw,
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
  payment_reference: string;
  payment_qr_data_uri?: string | null;
  total_amount: number;
  shipping_fee: number;
  expires_at?: string | null;
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
const ACTIVE_CHECKOUT_KEY = "rungu-active-checkout";

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
  bank_transfer: "Chuyển khoản ngân hàng (VietQR tự động)",
};

function CheckoutContent() {
  const router = useRouter();
  const {
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

  const [form, setForm] = useState<CheckoutForm>({
    ...initialForm,
    payment_method: defaultPaymentMethod,
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<CheckoutResult | null>(null);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [paymentExpired, setPaymentExpired] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState<number | null>(null);
  const [quote, setQuote] = useState<QuoteSnapshot | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState("");
  const [voucherCode, setVoucherCode] = useState("");
  const [appliedVoucherCode, setAppliedVoucherCode] = useState("");
  const [voucherRefresh, setVoucherRefresh] = useState(0);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showMobileSummary, setShowMobileSummary] = useState(false);
  const checkoutAttempt = useRef<CheckoutAttempt | null>(null);

  // Restore active payment session if user refreshed or navigated back
  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const savedResult = window.sessionStorage.getItem(ACTIVE_CHECKOUT_KEY);
        if (savedResult) {
          const parsed = JSON.parse(savedResult);
          if (parsed && typeof parsed.checkout_ref === "string") {
            setResult(parsed);
            if (parsed.payment_method) {
              setForm((prev) => ({ ...prev, payment_method: parsed.payment_method }));
            }
          }
        }
      } catch {
        // Session storage unavailable
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const resetCheckoutAttempt = () => {
    checkoutAttempt.current = null;
    try {
      window.sessionStorage.removeItem(CHECKOUT_ATTEMPT_KEY);
      window.sessionStorage.removeItem(ACTIVE_CHECKOUT_KEY);
    } catch {
      // Session storage unavailable
    }
  };

  const orderItems = useMemo(
    () => cart.map((item) => ({ variant_id: Number(item.variantId), quantity: item.qty })),
    [cart],
  );

  const quoteKey = JSON.stringify([form.payment_method, orderItems, appliedVoucherCode]);
  const validVariants = cart.length > 0 && orderItems.every((item) =>
    Number.isSafeInteger(item.variant_id) && item.variant_id > 0
      && Number.isInteger(item.quantity) && item.quantity > 0 && item.quantity <= 100,
  );

  const cartValidationError = !result && cart.length > 0 && !validVariants
    ? "Giỏ hàng có sản phẩm không còn hợp lệ. Vui lòng xóa và thêm lại từ trang sản phẩm."
    : "";

  const currentQuote = quote?.key === quoteKey ? quote.data : null;
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
      // In-memory ref handles idempotency
    }
    return attempt.ref;
  };

  // Preflight quote
  useEffect(() => {
    if (result || !validVariants) return;

    const controller = new AbortController();
    void Promise.resolve().then(() => {
      if (controller.signal.aborted) return;
      setQuote(null);
      setQuoteLoading(true);
      setQuoteError("");
      return requestQuote(orderItems, form.payment_method, appliedVoucherCode, controller.signal)
        .then((data) => setQuote({ key: quoteKey, data }))
        .catch((quoteFailure) => {
          if (!controller.signal.aborted) {
            setQuoteError(quoteFailure instanceof Error ? quoteFailure.message : "Không kiểm tra được đơn hàng.");
          }
        })
        .finally(() => {
          if (!controller.signal.aborted) setQuoteLoading(false);
        });
    });
    return () => controller.abort();
  }, [result, validVariants, quoteKey, orderItems, form.payment_method, appliedVoucherCode, voucherRefresh]);

  // Status check for VietQR
  useEffect(() => {
    if (!result?.checkout_ref || form.payment_method !== "bank_transfer" || paymentConfirmed || paymentExpired) return;
    let stopped = false;
    const check = async () => {
      try {
        const response = await fetch(`/api/checkout/status/${result.checkout_ref}`, { cache: "no-store" });
        const status = await response.json();
        if (!stopped && response.ok && status.order_code === result.order_code) {
          if (status.pay_status === 1) {
            setPaymentConfirmed(true);
            setPaymentExpired(false);
            clearCart();
            resetCheckoutAttempt();
          } else if (status.payment_state === "expired") {
            setPaymentExpired(true);
          }
        }
      } catch {
        // Keep pending until next interval
      }
    };
    void check();
    const timer = window.setInterval(check, 4000);
    return () => { stopped = true; window.clearInterval(timer); };
  }, [result, form.payment_method, paymentConfirmed, paymentExpired, clearCart]);

  // Countdown timer for VietQR
  useEffect(() => {
    if (!result?.expires_at || form.payment_method !== "bank_transfer" || paymentConfirmed) {
      return;
    }

    const expiresAt = new Date(result.expires_at).getTime();
    if (!Number.isFinite(expiresAt)) return;
    const updateCountdown = () => {
      const remaining = Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
      setSecondsRemaining(remaining);
      if (remaining === 0) setPaymentExpired(true);
    };
    updateCountdown();
    const timer = window.setInterval(updateCountdown, 1000);
    return () => window.clearInterval(timer);
  }, [result, form.payment_method, paymentConfirmed]);

  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const salesMethod = storefrontContent.sales[form.payment_method];
  const reachesFreeShipping = Boolean(
    salesMethod?.free_shipping
      || (salesMethod?.free_shipping_min_items && itemCount >= salesMethod.free_shipping_min_items),
  );
  const estimatedShipping = reachesFreeShipping ? 0 : Number(salesMethod?.shipping_fee ?? 0);
  const grandTotal = cartTotal + estimatedShipping;
  const isBankPaymentPending = form.payment_method === "bank_transfer" && !paymentConfirmed;
  const countdownLabel = secondsRemaining === null
    ? "Đang kiểm tra…"
    : `${String(Math.floor(secondsRemaining / 60)).padStart(2, "0")}:${String(secondsRemaining % 60).padStart(2, "0")}`;

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
      setError("Giỏ hàng đang trống. Vui lòng thêm sản phẩm trước khi thanh toán.");
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

      const paymentQrDataUri = typeof payload.payment_qr_data_uri === "string" && payload.payment_qr_data_uri.startsWith("data:image/png;base64,")
        ? payload.payment_qr_data_uri
        : null;
      if (form.payment_method === "bank_transfer" && !paymentQrDataUri) {
        throw new Error("Chưa thể xác nhận mã VietQR. Vui lòng thử lại; hệ thống sẽ không tạo trùng đơn.");
      }

      const newResult: CheckoutResult = {
        checkout_ref: typeof payload.checkout_ref === "string" ? payload.checkout_ref : checkoutRef,
        order_code: payload.order_code,
        payment_reference: typeof payload.payment_reference === "string" && payload.payment_reference.trim()
          ? payload.payment_reference
          : `SEVQR ${payload.order_code}`,
        payment_qr_data_uri: paymentQrDataUri,
        total_amount: Number(payload.total_amount),
        shipping_fee: Number(payload.shipping_fee),
        expires_at: typeof payload.expires_at === "string" ? payload.expires_at : null,
        message: payload.message,
      };

      setPaymentConfirmed(Number(payload.pay_status) === 1);
      setPaymentExpired(false);
      setResult(newResult);

      try {
        window.sessionStorage.setItem(
          ACTIVE_CHECKOUT_KEY,
          JSON.stringify({ ...newResult, payment_method: form.payment_method }),
        );
      } catch {
        // Session storage unavailable
      }

      if (form.payment_method !== "bank_transfer" || Number(payload.pay_status) === 1) {
        resetCheckoutAttempt();
        clearCart();
      }

      // Scroll smoothly to top for the result view
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : "Không thể tạo đơn hàng.");
    } finally {
      setSubmitting(false);
    }
  };

  const restartExpiredPayment = () => {
    resetCheckoutAttempt();
    setPaymentConfirmed(false);
    setPaymentExpired(false);
    setSecondsRemaining(null);
    setResult(null);
    setError("");
  };

  const resetForNewOrder = () => {
    resetCheckoutAttempt();
    setResult(null);
    setPaymentConfirmed(false);
    setPaymentExpired(false);
    setSecondsRemaining(null);
    setForm({ ...initialForm, payment_method: defaultPaymentMethod });
    router.push("/shop-all");
  };

  const bankQrUrl = result && form.payment_method === "bank_transfer"
    ? result.payment_qr_data_uri || null
    : null;

  return (
    <div className="min-h-screen bg-[#f7f5f0] text-forest-950 font-ui selection:bg-[#9d753d] selection:text-white pb-16 sm:pb-24 overflow-x-hidden">
      {/* Top Banner / Breadcrumb - Compact on mobile */}
      <div className="border-b border-forest-800/10 bg-white sticky top-0 z-30 shadow-2xs">
        <div className="mx-auto w-full max-w-full 2xl:max-w-[1800px] px-3.5 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-3 sm:py-4 flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Link
              href="/"
              className="font-serif text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-forest-950 hover:text-amberWood-dark transition-colors shrink-0"
            >
              RUNGU
            </Link>
            <span className="text-forest-400">/</span>
            <span className="text-xs sm:text-sm font-semibold text-forest-700 truncate">
              {result
                ? (isBankPaymentPending ? "Thanh toán chuyển khoản" : "Xác nhận đơn")
                : "Thanh toán"}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="flex items-center gap-1.5 bg-forest-50 border border-forest-800/10 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[11px] sm:text-xs text-forest-700">
              <Lock className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-emerald-700 shrink-0" />
              <span className="hidden xs:inline">Bảo mật SSL 100%</span>
              <span className="xs:hidden">Bảo mật</span>
            </div>
            {!result && (
              <Link
                href="/shop-all"
                className="hidden sm:inline-flex items-center gap-1 text-xs text-forest-700 hover:text-forest-950 transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Mua sắm</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Stepper indicator - Fully responsive for all mobile widths */}
      <div className="mx-auto w-full max-w-full 2xl:max-w-[1800px] px-3.5 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 pt-4 sm:pt-6">
        <div className="flex items-center justify-center gap-1.5 sm:gap-4 text-[11px] sm:text-sm font-semibold text-forest-600">
          <div className={`flex items-center gap-1 sm:gap-1.5 shrink-0 ${!result ? "text-amberWood-dark font-bold" : "text-emerald-700"}`}>
            <span className={`flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full text-[10px] sm:text-xs text-white shrink-0 ${!result ? "bg-amberWood-dark" : "bg-emerald-600"}`}>
              {!result ? "1" : <Check className="h-3 w-3 sm:h-3.5 sm:w-3.5" />}
            </span>
            <span className="hidden sm:inline">Thông tin giao hàng</span>
            <span className="sm:hidden">Thông tin</span>
          </div>
          <div className="h-px w-3 sm:w-10 bg-forest-800/20 shrink-0" />
          <div className={`flex items-center gap-1 sm:gap-1.5 shrink-0 ${result && isBankPaymentPending ? "text-amberWood-dark font-bold" : result && paymentConfirmed ? "text-emerald-700" : "text-forest-400"}`}>
            <span className={`flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full text-[10px] sm:text-xs shrink-0 ${result && isBankPaymentPending ? "bg-amberWood-dark text-white" : result && paymentConfirmed ? "bg-emerald-600 text-white" : "bg-forest-200 text-forest-600"}`}>
              {result && paymentConfirmed ? <Check className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> : "2"}
            </span>
            <span className="hidden sm:inline">Thanh toán VietQR</span>
            <span className="sm:hidden">Thanh toán</span>
          </div>
          <div className="h-px w-3 sm:w-10 bg-forest-800/20 shrink-0" />
          <div className={`flex items-center gap-1 sm:gap-1.5 shrink-0 ${result && !isBankPaymentPending ? "text-emerald-700 font-bold" : "text-forest-400"}`}>
            <span className={`flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full text-[10px] sm:text-xs shrink-0 ${result && !isBankPaymentPending ? "bg-emerald-600 text-white" : "bg-forest-200 text-forest-600"}`}>
              3
            </span>
            <span className="hidden sm:inline">Hoàn tất đơn</span>
            <span className="sm:hidden">Hoàn tất</span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="mx-auto w-full max-w-full 2xl:max-w-[1800px] px-3.5 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 pt-5 sm:pt-8">
        {result ? (
          /* ==================== VIEW: PAYMENT / SUCCESS RESULT ==================== */
          <div className="mx-auto max-w-3xl">
            {/* Header Result Card */}
            <div className="rounded-2xl sm:rounded-3xl border border-forest-800/15 bg-white p-5 sm:p-8 md:p-10 text-center shadow-sm">
              <div className={`mx-auto flex h-14 w-14 sm:h-18 sm:w-18 items-center justify-center rounded-full ${isBankPaymentPending ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-700"}`}>
                {isBankPaymentPending ? (
                  <Clock3 className="h-8 w-8 sm:h-10 sm:w-10" strokeWidth={2} />
                ) : (
                  <CheckCircle2 className="h-8 w-8 sm:h-10 sm:w-10" strokeWidth={2} />
                )}
              </div>

              <h1 className="mt-4 sm:mt-5 font-serif text-2xl sm:text-3xl md:text-4xl text-forest-950 font-medium tracking-tight">
                {isBankPaymentPending
                  ? (paymentExpired ? "Mã thanh toán đã hết hạn" : "Chờ xác nhận chuyển khoản")
                  : "RUNGU đã nhận đơn của bạn!"}
              </h1>

              <p className="mt-2 text-xs sm:text-base text-forest-700 max-w-xl mx-auto leading-relaxed">
                {isBankPaymentPending
                  ? (paymentExpired
                    ? "Phiên thanh toán đã hết thời gian 15 phút. Bạn hãy tạo mã VietQR mới để hoàn tất đặt hàng nhé."
                    : "Đơn hàng sẽ được tạo và xác nhận tự động ngay sau khi ngân hàng ghi nhận giao dịch thành công qua SePay.")
                  : "Cảm ơn bạn đã lựa chọn những nốt hương mộc mạc và an lành từ thiên nhiên."}
              </p>

              {/* Order Info Badge - Stacks cleanly on mobile without wrapping artifacts */}
              <div className="mt-5 sm:mt-6 flex flex-col xs:flex-row items-center justify-center gap-3 sm:gap-8 rounded-xl sm:rounded-2xl bg-forest-50 border border-forest-800/10 p-3.5 sm:px-6 sm:py-4 shadow-2xs w-full max-w-md mx-auto">
                <div className="text-center xs:text-left">
                  <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-forest-600 block">
                    {isBankPaymentPending ? "Mã thanh toán" : "Mã đơn hàng"}
                  </span>
                  <strong className="font-mono text-base sm:text-lg font-bold text-forest-950">{result.order_code}</strong>
                </div>
                <div className="h-px w-full xs:h-8 xs:w-px bg-forest-800/15" />
                <div className="text-center xs:text-left">
                  <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-forest-600 block">
                    Tổng thanh toán
                  </span>
                  <strong className="font-serif text-xl sm:text-2xl font-bold text-amberWood-dark">
                    {result.total_amount.toLocaleString("vi-VN")} đ
                  </strong>
                </div>
              </div>
            </div>

            {/* Bank Transfer QR & Information Section */}
            {isBankPaymentPending && bank ? (
              <div className="mt-5 sm:mt-6 rounded-2xl sm:rounded-3xl border border-forest-800/15 bg-white p-4 sm:p-7 md:p-8 shadow-sm">
                <div className="flex items-center gap-2 text-sm sm:text-base font-bold uppercase tracking-wider text-forest-950 pb-3 sm:pb-4 border-b border-forest-800/10">
                  <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-amberWood-dark shrink-0" />
                  <span>Thông tin chuyển khoản ngân hàng</span>
                </div>

                {/* Countdown Alert */}
                <div className={`mt-4 sm:mt-5 flex flex-wrap items-center justify-between gap-2 rounded-xl sm:rounded-2xl border px-3.5 py-3 ${paymentExpired ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50/80 text-amber-950"}`}>
                  <div className="flex items-center gap-2">
                    <Clock3 className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
                    <span className="text-xs sm:text-sm font-semibold">
                      {paymentExpired ? "Phiên thanh toán đã hết hạn" : "Thời gian giữ đơn và mã QR còn lại"}
                    </span>
                  </div>
                  <strong className="font-mono text-lg sm:text-2xl font-bold tracking-wider">
                    {paymentExpired ? "00:00" : countdownLabel}
                  </strong>
                </div>

                {/* QR Code and Bank Details Layout */}
                <div className="mt-5 sm:mt-6 grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center">
                  {/* QR Image */}
                  {!paymentExpired && bankQrUrl && (
                    <div className="md:col-span-5 text-center flex flex-col items-center">
                      <div className="inline-block rounded-2xl border-2 border-forest-800/15 bg-white p-3 sm:p-4 shadow-md max-w-full">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={bankQrUrl}
                          alt={`Mã VietQR thanh toán cho đơn ${result.order_code}`}
                          className="h-48 w-48 sm:h-56 sm:w-56 md:h-60 md:w-60 object-contain mx-auto"
                        />
                      </div>
                      <p className="mt-2 text-[11px] sm:text-xs text-forest-600 font-medium max-w-xs">
                        Mở App ngân hàng &gt; Quét mã VietQR để thanh toán tự động
                      </p>
                      {/* Mobile convenience: Download QR code */}
                      <a
                        href={bankQrUrl}
                        download={`VietQR-${result.order_code}.png`}
                        className="mt-2.5 inline-flex items-center gap-1.5 rounded-xl border border-forest-800/20 bg-forest-50 px-3 py-1.5 text-xs font-bold text-forest-800 hover:bg-forest-100 transition-colors cursor-pointer"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>Tải ảnh QR về máy</span>
                      </a>
                    </div>
                  )}

                  {/* Account fields - Flex-col on mobile to prevent overflow/wrap clipping */}
                  <div className={`${!paymentExpired && bankQrUrl ? "md:col-span-7" : "md:col-span-12"} space-y-3 text-sm`}>
                    <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-1 xs:gap-3 py-2 border-b border-forest-800/10">
                      <span className="text-xs sm:text-sm font-medium text-forest-600">Ngân hàng</span>
                      <strong className="font-bold text-sm sm:text-base text-forest-950">{bank.code}</strong>
                    </div>

                    <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-1 xs:gap-3 py-2 border-b border-forest-800/10">
                      <span className="text-xs sm:text-sm font-medium text-forest-600">Số tài khoản</span>
                      <div className="flex items-center justify-between xs:justify-end gap-2">
                        <strong className="font-mono text-base sm:text-lg font-bold text-forest-950">{bank.account_number}</strong>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(bank.account_number, "stk")}
                          className="inline-flex items-center gap-1 rounded-lg bg-forest-50 px-2 py-1 text-xs font-bold border border-forest-800/20 text-forest-800 hover:bg-forest-100 transition-colors cursor-pointer shrink-0"
                        >
                          {copiedField === "stk" ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                          <span>{copiedField === "stk" ? "Đã chép" : "Sao chép"}</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-1 xs:gap-3 py-2 border-b border-forest-800/10">
                      <span className="text-xs sm:text-sm font-medium text-forest-600">Chủ tài khoản</span>
                      <strong className="font-bold text-sm sm:text-base text-forest-950 uppercase">{bank.account_name}</strong>
                    </div>

                    <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-1 xs:gap-3 py-2 border-b border-forest-800/10">
                      <span className="text-xs sm:text-sm font-medium text-forest-600">Số tiền chính xác</span>
                      <div className="flex items-center justify-between xs:justify-end gap-2">
                        <strong className="font-serif text-lg sm:text-xl font-bold text-amberWood-dark">
                          {result.total_amount.toLocaleString("vi-VN")} đ
                        </strong>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(String(result.total_amount), "amount")}
                          className="inline-flex items-center gap-1 rounded-lg bg-forest-50 px-2 py-1 text-xs font-bold border border-forest-800/20 text-forest-800 hover:bg-forest-100 transition-colors cursor-pointer shrink-0"
                        >
                          {copiedField === "amount" ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                          <span>{copiedField === "amount" ? "Đã chép" : "Sao chép"}</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-1.5 xs:gap-3 py-2.5">
                      <span className="text-xs sm:text-sm font-medium text-forest-600">Nội dung chuyển khoản</span>
                      <div className="flex items-center justify-between xs:justify-end gap-2 w-full xs:w-auto">
                        <span className="font-mono text-sm sm:text-base font-bold rounded-lg bg-amber-100 border border-amber-300 px-2.5 py-1 text-amber-950 break-all">
                          {result.payment_reference}
                        </span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(result.payment_reference, "code")}
                          className="inline-flex items-center gap-1 rounded-lg bg-forest-50 px-2 py-1 text-xs font-bold border border-forest-800/20 text-forest-800 hover:bg-forest-100 transition-colors cursor-pointer shrink-0"
                        >
                          {copiedField === "code" ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                          <span>{copiedField === "code" ? "Đã chép" : "Sao chép"}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SePay Note */}
                <div className="mt-5 sm:mt-6 rounded-xl sm:rounded-2xl bg-forest-50 border border-forest-800/10 p-3 sm:p-4 text-xs leading-relaxed text-forest-800 flex items-start gap-2.5">
                  <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-700 shrink-0 mt-0.5" />
                  <p>
                    {paymentConfirmed
                      ? "SePay đã tự động xác nhận chuyển khoản thành công. Cửa hàng đang đóng gói và chuẩn bị đơn hàng của bạn!"
                      : paymentExpired
                        ? "Phiên này đã kết thúc để đảm bảo an toàn. Vui lòng bấm 'Tạo mã VietQR mới' trước khi chuyển tiền."
                        : "Hệ thống SePay tự động ghi nhận thanh toán trong vòng 3–15 giây. Vui lòng ghi chính xác Nội dung chuyển khoản ở trên để đơn được duyệt tự động."}
                  </p>
                </div>

                {paymentExpired && (
                  <button
                    type="button"
                    onClick={restartExpiredPayment}
                    className="mt-5 sm:mt-6 w-full rounded-xl sm:rounded-2xl bg-forest-900 py-3.5 sm:py-4 text-xs sm:text-sm font-bold uppercase tracking-wider text-white transition-all hover:bg-forest-950 shadow-md cursor-pointer flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span>Tạo mã VietQR mới</span>
                  </button>
                )}
              </div>
            ) : (
              /* COD Delivery Summary */
              <div className="mt-5 sm:mt-6 rounded-2xl sm:rounded-3xl border border-forest-800/15 bg-white p-4 sm:p-7 shadow-sm">
                <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-forest-950 text-sm sm:text-base pb-3 border-b border-forest-800/10">
                  <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-amberWood-dark shrink-0" />
                  <span>Phương thức: Thanh toán khi nhận hàng (COD)</span>
                </div>
                <p className="mt-3 text-forest-800 leading-relaxed text-xs sm:text-sm">
                  Cửa hàng sẽ liên hệ với bạn theo số điện thoại đã cung cấp để xác nhận và gửi đơn. Bạn có thể kiểm tra sản phẩm trước khi thanh toán tiền mặt cho nhân viên giao hàng.
                </p>
              </div>
            )}

            {/* Action Button */}
            <div className="mt-6 sm:mt-8 text-center">
              <button
                type="button"
                onClick={resetForNewOrder}
                className="inline-flex items-center justify-center gap-2 rounded-xl sm:rounded-2xl bg-forest-900 px-6 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-base font-bold uppercase tracking-wider text-white hover:bg-forest-950 transition-all shadow-md cursor-pointer w-full sm:w-auto"
              >
                <span>Tiếp tục khám phá sản phẩm</span>
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
          </div>
        ) : cart.length === 0 ? (
          /* ==================== VIEW: EMPTY CART ==================== */
          <div className="mx-auto max-w-xl text-center py-12 sm:py-20 rounded-2xl sm:rounded-3xl border border-forest-800/15 bg-white p-6 sm:p-8 shadow-sm">
            <div className="mx-auto flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-forest-50 text-forest-500 border border-forest-800/10">
              <ShoppingBag className="h-8 w-8 sm:h-10 sm:w-10" strokeWidth={1.4} />
            </div>
            <h2 className="mt-4 sm:mt-6 font-serif text-2xl sm:text-3xl font-medium text-forest-950">Giỏ hàng đang trống</h2>
            <p className="mt-2 text-forest-600 text-xs sm:text-base max-w-md mx-auto leading-relaxed">
              Hãy dạo một vòng và chọn cho mình những nốt hương hoặc vật phẩm mộc ưng ý trước khi đặt hàng nhé.
            </p>
            <div className="mt-6 sm:mt-8">
              <Link
                href="/shop-all"
                className="inline-flex items-center justify-center gap-2 rounded-xl sm:rounded-2xl bg-forest-900 px-6 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-sm font-bold uppercase tracking-wider text-white hover:bg-forest-950 transition-all shadow-md"
              >
                <span>Khám phá sản phẩm ngay</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ) : (
          /* ==================== VIEW: CHECKOUT FORM (MOBILE ACCORDION + 2-COLUMN) ==================== */
          <div>
            {/* Mobile Only: Collapsible Order Summary Banner at Top */}
            <div className="lg:hidden rounded-2xl border border-forest-800/15 bg-white p-3.5 sm:p-4 shadow-xs mb-5">
              <button
                type="button"
                onClick={() => setShowMobileSummary(!showMobileSummary)}
                className="flex w-full items-center justify-between text-left cursor-pointer"
                aria-expanded={showMobileSummary}
              >
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4 text-amberWood-dark shrink-0" />
                  <span className="text-xs sm:text-sm font-bold text-forest-950">
                    {showMobileSummary ? "Thu gọn tóm tắt đơn" : `Tóm tắt đơn hàng (${itemCount} món)`}
                  </span>
                  {showMobileSummary ? (
                    <ChevronUp className="h-3.5 w-3.5 text-forest-600" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5 text-forest-600" />
                  )}
                </div>
                <span className="font-serif text-base sm:text-lg font-bold text-forest-950">
                  {(displayedQuote?.total_amount ?? grandTotal).toLocaleString("vi-VN")} đ
                </span>
              </button>

              {showMobileSummary && (
                <div className="mt-3 pt-3 border-t border-forest-800/10 space-y-3">
                  <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                    {cart.map((item) => (
                      <div key={item.cartKey} className="flex items-center gap-2.5 text-xs">
                        <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-forest-50 border border-forest-800/10">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="truncate font-semibold text-forest-950">{item.name}</p>
                          <p className="text-[11px] text-forest-600 truncate">{item.variantLabel} × {item.qty}</p>
                        </div>
                        <span className="font-semibold text-forest-900 shrink-0">
                          {(item.price * item.qty).toLocaleString("vi-VN")} đ
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-forest-800/10 pt-2 text-xs space-y-1.5 text-forest-700">
                    <div className="flex justify-between">
                      <span>Tạm tính</span>
                      <span>{(displayedQuote?.subtotal ?? cartTotal).toLocaleString("vi-VN")} đ</span>
                    </div>
                    {(displayedQuote?.discount ?? 0) > 0 && (
                      <div className="flex items-center justify-between text-emerald-800 font-medium">
                        <span className="truncate pr-2">Giảm voucher ({appliedVoucherCode})</span>
                        <span className="shrink-0 font-bold">−{displayedQuote?.discount.toLocaleString("vi-VN")} đ</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Phí giao hàng</span>
                      <span>
                        {(displayedQuote?.shipping_fee ?? estimatedShipping) === 0
                          ? "Miễn phí"
                          : `${(displayedQuote?.shipping_fee ?? estimatedShipping).toLocaleString("vi-VN")} đ`}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={submitOrder} className="w-full space-y-6 sm:space-y-8">
              {/* Khối thống nhất gộp chung các phần theo thứ tự từ trên xuống dưới, chiều ngang toàn màn hình */}
              <div className="w-full rounded-2xl sm:rounded-3xl border border-forest-800/15 bg-white shadow-sm overflow-hidden">
                {/* Phần 1: Thông tin giao hàng */}
                <div className="p-4 sm:p-7 md:p-8 lg:p-9 space-y-4 sm:space-y-6">
                  <div className="flex items-center gap-2 pb-3.5 border-b border-forest-800/10">
                    <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-forest-50 text-amberWood-dark font-bold text-xs sm:text-sm border border-forest-800/15 shrink-0">
                      1
                    </div>
                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-amberWood-dark shrink-0" />
                    <h2 className="text-sm sm:text-base md:text-lg font-bold uppercase tracking-wider text-forest-950">
                      Thông tin giao hàng
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-5">
                    <InputField
                      id="customer_name"
                      name="name"
                      label="Họ và tên người nhận"
                      required
                      placeholder="Ví dụ: Nguyễn Văn An"
                      autoComplete="name"
                      value={form.customer_name}
                      onChange={(val) => setForm({ ...form, customer_name: val })}
                    />
                    <InputField
                      id="customer_phone"
                      name="phone"
                      label="Số điện thoại nhận hàng"
                      required
                      type="tel"
                      inputMode="tel"
                      placeholder="Ví dụ: 0912 345 678"
                      autoComplete="tel"
                      value={form.customer_phone}
                      onChange={(val) => setForm({ ...form, customer_phone: val })}
                    />
                    <InputField
                      id="customer_email"
                      name="email"
                      label="Email nhận thông báo"
                      type="email"
                      inputMode="email"
                      optional
                      placeholder="Ví dụ: name@example.com (không bắt buộc)"
                      autoComplete="email"
                      value={form.customer_email}
                      onChange={(val) => setForm({ ...form, customer_email: val })}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-5">
                    <InputField
                      id="province"
                      name="province"
                      label="Tỉnh / Thành phố"
                      required
                      placeholder="Ví dụ: Hà Nội, TP. Hồ Chí Minh..."
                      autoComplete="address-level1"
                      value={form.province}
                      onChange={(val) => setForm({ ...form, province: val })}
                    />
                    <InputField
                      id="ward"
                      name="ward"
                      label="Phường / Xã (hoặc Quận / Huyện)"
                      required
                      placeholder="Ví dụ: Phường Bến Nghé, Quận 1"
                      autoComplete="address-level2"
                      value={form.ward}
                      onChange={(val) => setForm({ ...form, ward: val })}
                    />
                    <InputField
                      id="address"
                      name="address"
                      label="Địa chỉ cụ thể (Số nhà, tên đường)"
                      required
                      placeholder="Ví dụ: Số 24 ngõ 12 phố Tràng Tiền"
                      autoComplete="street-address"
                      value={form.address}
                      onChange={(val) => setForm({ ...form, address: val })}
                    />
                  </div>

                  <div>
                    <label htmlFor="note" className="block text-xs sm:text-sm font-bold text-forest-950 mb-1.5">
                      Ghi chú đơn hàng <span className="text-[11px] sm:text-xs font-normal text-forest-600">(không bắt buộc)</span>
                    </label>
                    <textarea
                      id="note"
                      name="note"
                      value={form.note}
                      onChange={(e) => setForm({ ...form, note: e.target.value })}
                      rows={2}
                      placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi đến, gửi bác bảo vệ..."
                      className="w-full rounded-xl sm:rounded-2xl border border-forest-800/25 bg-white p-3 sm:p-3.5 text-sm sm:text-base text-forest-950 placeholder:text-forest-400 placeholder:text-xs sm:placeholder:text-sm focus:border-forest-900 focus:ring-2 focus:ring-forest-800/20 focus:outline-none transition-all shadow-2xs"
                    />
                  </div>
                </div>

                {/* Phần 2: Hình thức thanh toán */}
                <div className="border-t border-forest-800/10 p-4 sm:p-7 md:p-8 lg:p-9 space-y-4 sm:space-y-6">
                  <div className="flex items-center gap-2 pb-3.5 border-b border-forest-800/10">
                    <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-forest-50 text-amberWood-dark font-bold text-xs sm:text-sm border border-forest-800/15 shrink-0">
                      2
                    </div>
                    <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-amberWood-dark shrink-0" />
                    <h2 className="text-sm sm:text-base md:text-lg font-bold uppercase tracking-wider text-forest-950">
                      Hình thức thanh toán
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-5">
                    {enabledMethods.map(([key]) => {
                      const isSelected = form.payment_method === key;
                      const isCOD = key === "cod";
                      const isBank = key === "bank_transfer";

                      return (
                        <label
                          key={key}
                          className={`flex cursor-pointer items-start gap-3 sm:gap-4 rounded-xl sm:rounded-2xl border p-4 sm:p-5 transition-all ${
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
                            onChange={() => setForm((c) => ({ ...c, payment_method: key }))}
                            className="mt-1 h-4.5 w-4.5 text-forest-900 accent-forest-900 focus:ring-forest-800 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                              {isCOD ? (
                                <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-amberWood-dark shrink-0" />
                              ) : isBank ? (
                                <QrCode className="h-4 w-4 sm:h-5 sm:w-5 text-amberWood-dark shrink-0" />
                              ) : null}
                              <span className="text-xs sm:text-base font-bold text-forest-950 leading-snug">
                                {paymentLabels[key] ?? key}
                              </span>
                              {isBank && (
                                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] sm:text-xs font-bold text-emerald-800 shrink-0">
                                  VietQR Tự động
                                </span>
                              )}
                            </div>
                            <p className="mt-1.5 text-xs sm:text-sm text-forest-700 leading-relaxed">
                              {isCOD
                                ? "Nhận hàng tận nơi, kiểm tra sản phẩm trước khi thanh toán tiền mặt cho nhân viên giao hàng."
                                : isBank
                                ? "Quét mã VietQR tiện lợi bằng ứng dụng mọi ngân hàng. Xác nhận thanh toán tự động tức thì."
                                : "Thanh toán cho đơn hàng."}
                            </p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Phần 3: Mã ưu đãi (Voucher) */}
                <div className="border-t border-forest-800/10 p-4 sm:p-7 md:p-8 lg:p-9 space-y-4 sm:space-y-5">
                  <div className="flex items-center gap-2 pb-3.5 border-b border-forest-800/10">
                    <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-forest-50 text-amberWood-dark font-bold text-xs sm:text-sm border border-forest-800/15 shrink-0">
                      3
                    </div>
                    <Ticket className="h-4 w-4 sm:h-5 sm:w-5 text-amberWood-dark shrink-0" />
                    <h2 className="text-sm sm:text-base md:text-lg font-bold uppercase tracking-wider text-forest-950">
                      Mã ưu đãi (Voucher)
                    </h2>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 max-w-xl">
                    <input
                      type="text"
                      value={voucherCode}
                      onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          applyVoucher();
                        }
                      }}
                      maxLength={50}
                      placeholder="Nhập mã ưu đãi (nếu có)"
                      aria-label="Mã giảm giá"
                      className="min-w-0 flex-1 rounded-xl sm:rounded-2xl border border-forest-800/25 bg-white px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-base font-semibold uppercase tracking-wider text-forest-950 placeholder:normal-case placeholder:font-normal placeholder:tracking-normal placeholder:text-forest-400 placeholder:text-xs sm:placeholder:text-sm focus:border-forest-900 focus:ring-2 focus:ring-forest-800/20 focus:outline-none transition-all shadow-2xs"
                    />
                    <button
                      type="button"
                      onClick={applyVoucher}
                      className="rounded-xl sm:rounded-2xl bg-forest-900 px-5 sm:px-7 py-2.5 sm:py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-white hover:bg-forest-950 transition-all shadow-2xs shrink-0 cursor-pointer whitespace-nowrap active:scale-[0.98]"
                    >
                      Áp dụng
                    </button>
                  </div>

                  {quoteError && (
                    <div role="alert" className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs sm:text-sm text-red-800 max-w-xl">
                      <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                      <p className="flex-1 min-w-0 leading-relaxed">{quoteError}</p>
                    </div>
                  )}

                  {appliedVoucherCode && (
                    <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2.5 rounded-xl sm:rounded-2xl bg-emerald-50 border border-emerald-200 p-3 sm:px-4 sm:py-3 text-xs sm:text-sm text-emerald-900 max-w-xl" role="status">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <Tag className="h-4 w-4 text-emerald-700 shrink-0" />
                        <div className="min-w-0 flex-1 truncate">
                          <span className="text-emerald-800">Đã áp dụng: </span>
                          <strong className="font-bold text-emerald-950 font-mono tracking-wide">{appliedVoucherCode}</strong>
                          {!currentQuote && <span className="text-[11px] text-emerald-700 ml-1">(đang tính...)</span>}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setVoucherCode("");
                          setAppliedVoucherCode("");
                          setVoucherRefresh((c) => c + 1);
                        }}
                        className="inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1 text-xs font-bold text-red-600 border border-red-200/80 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer shrink-0 ml-auto"
                      >
                        <X className="h-3.5 w-3.5" />
                        <span>Bỏ mã</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Phần 4: Đơn hàng của bạn & Xác nhận thanh toán */}
                <div className="border-t border-forest-800/10 bg-forest-50/40 p-4 sm:p-7 md:p-8 lg:p-9 space-y-5 sm:space-y-6">
                  <div className="flex items-center justify-between pb-3.5 border-b border-forest-800/10">
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 text-forest-700 shrink-0" />
                      <h2 className="text-sm sm:text-base md:text-lg font-bold uppercase tracking-wider text-forest-950">
                        Đơn hàng của bạn ({itemCount} sản phẩm)
                      </h2>
                    </div>
                    <Link
                      href="/shop-all"
                      className="text-xs sm:text-sm font-bold text-amberWood-dark hover:underline"
                    >
                      + Thêm món khác
                    </Link>
                  </div>

                  {/* Items List */}
                  <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                    {cart.map((item) => (
                      <div key={item.cartKey} className="flex items-center gap-3 sm:gap-4 rounded-xl sm:rounded-2xl bg-white border border-forest-800/10 p-2.5 sm:p-3.5 shadow-2xs">
                        <div className="h-14 w-14 sm:h-16 sm:w-16 flex-shrink-0 overflow-hidden rounded-xl bg-forest-50 border border-forest-800/10">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="truncate font-serif text-sm sm:text-base font-semibold text-forest-950">{item.name}</p>
                          <p className="text-[11px] sm:text-xs text-forest-600 truncate">{item.variantLabel}</p>
                          <div className="mt-0.5 flex items-center gap-1.5 text-xs text-forest-700">
                            <span>{item.price.toLocaleString("vi-VN")} đ</span>
                            <span>×</span>
                            <span className="font-bold text-forest-950">{item.qty}</span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="font-bold text-xs sm:text-base text-forest-950 block">
                            {(item.price * item.qty).toLocaleString("vi-VN")} đ
                          </span>
                          <div className="mt-1 flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => changeQty(item.cartKey, -1)}
                              className="h-6 w-6 sm:h-7 sm:w-7 rounded bg-forest-50 border border-forest-800/20 text-xs font-bold text-forest-800 hover:bg-forest-100 flex items-center justify-center cursor-pointer"
                              aria-label="Giảm"
                            >
                              −
                            </button>
                            <button
                              type="button"
                              onClick={() => changeQty(item.cartKey, 1)}
                              className="h-6 w-6 sm:h-7 sm:w-7 rounded bg-forest-50 border border-forest-800/20 text-xs font-bold text-forest-800 hover:bg-forest-100 flex items-center justify-center cursor-pointer"
                              aria-label="Tăng"
                            >
                              +
                            </button>
                            <button
                              type="button"
                              onClick={() => changeQty(item.cartKey, -item.qty)}
                              className="h-6 w-6 sm:h-7 sm:w-7 rounded bg-forest-50 border border-forest-800/20 text-xs text-forest-500 hover:text-red-600 hover:bg-red-50 flex items-center justify-center cursor-pointer ml-1"
                              aria-label={`Xóa ${item.name}`}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Free shipping banner */}
                  <div className="flex items-center gap-2 rounded-xl bg-forest-100/70 border border-forest-800/10 p-3 text-xs sm:text-sm font-medium text-forest-800">
                    <Truck className="h-4 w-4 text-amberWood-dark shrink-0" />
                    <span>
                      {estimatedShipping === 0
                        ? "Đơn hàng của bạn được miễn phí vận chuyển toàn quốc!"
                        : `Phí vận chuyển dự kiến: ${estimatedShipping.toLocaleString("vi-VN")} đ`}
                    </span>
                  </div>

                  {/* Price Breakdown */}
                  <div className="rounded-2xl border border-forest-800/10 bg-white p-4 sm:p-5 shadow-2xs space-y-3 text-xs sm:text-sm">
                    <div className="flex justify-between items-center text-forest-700">
                      <span className="font-medium">Tạm tính ({itemCount} món)</span>
                      <span className="font-semibold text-forest-950">
                        {(displayedQuote?.subtotal ?? cartTotal).toLocaleString("vi-VN")} đ
                      </span>
                    </div>

                    {(displayedQuote?.discount ?? 0) > 0 && (
                      <div className="flex justify-between items-center text-emerald-800 font-medium">
                        <span className="truncate pr-2">Giảm giá voucher ({appliedVoucherCode})</span>
                        <span className="font-bold shrink-0">
                          −{displayedQuote?.discount.toLocaleString("vi-VN")} đ
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between items-center text-forest-700">
                      <span className="font-medium">Phí vận chuyển</span>
                      <span className="font-semibold text-forest-950">
                        {(displayedQuote?.shipping_fee ?? estimatedShipping) === 0 ? (
                          <span className="text-emerald-700 font-bold bg-emerald-100/80 px-2.5 py-0.5 rounded-full text-xs">
                            Miễn phí giao hàng
                          </span>
                        ) : (
                          `${(displayedQuote?.shipping_fee ?? estimatedShipping).toLocaleString("vi-VN")} đ`
                        )}
                      </span>
                    </div>

                    <div className="border-t border-forest-800/15 pt-3.5 flex justify-between items-baseline">
                      <div>
                        <span className="block text-sm sm:text-base font-bold text-forest-950">Tổng thanh toán</span>
                        <span className="text-[11px] sm:text-xs text-forest-600 font-normal">Đã bao gồm VAT &amp; phí vận chuyển</span>
                      </div>
                      <span className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-amberWood-dark">
                        {(displayedQuote?.total_amount ?? grandTotal).toLocaleString("vi-VN")} đ
                      </span>
                    </div>
                  </div>

                  {/* Status and Error Alerts */}
                  {enabledMethods.length === 0 && (
                    <div role="alert" className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs sm:text-sm font-medium text-red-800">
                      <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 shrink-0 mt-0.5" />
                      <p>Chưa có hình thức thanh toán nào sẵn sàng. Vui lòng liên hệ với cửa hàng để được hỗ trợ.</p>
                    </div>
                  )}

                  {quoteLoading && (
                    <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-forest-800 bg-white p-3.5 rounded-xl border border-forest-800/10 shadow-2xs">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-forest-700 border-t-transparent shrink-0" />
                      <span>Đang tính toán lại khuyến mãi và phí vận chuyển...</span>
                    </div>
                  )}

                  {cartValidationError && (
                    <div role="alert" className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs sm:text-sm font-medium text-red-800">
                      <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 shrink-0 mt-0.5" />
                      <p>{cartValidationError}</p>
                    </div>
                  )}

                  {error && (
                    <div role="alert" className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs sm:text-sm font-medium text-red-800">
                      <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 shrink-0 mt-0.5" />
                      <p>{error}</p>
                    </div>
                  )}

                  {/* Submit Order Button */}
                  <button
                    type="submit"
                    disabled={submitting || quoteLoading || !currentQuote || enabledMethods.length === 0}
                    className="h-14 sm:h-16 w-full rounded-xl sm:rounded-2xl bg-forest-900 hover:bg-forest-950 active:scale-[0.99] text-white font-bold text-base sm:text-lg md:text-xl tracking-wide shadow-md transition-all flex items-center justify-center gap-2 sm:gap-3 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        <span>Đang xử lý đơn hàng...</span>
                      </>
                    ) : (
                      <>
                        <span>Xác nhận đặt hàng</span>
                        <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6" />
                      </>
                    )}
                  </button>

                  {/* Trust and Safety Badges */}
                  <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 pt-2 text-xs sm:text-sm text-forest-700">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-emerald-700 shrink-0" />
                      <span>Kiểm tra hàng thoải mái trước khi nhận (COD)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-700 shrink-0" />
                      <span>100% hương mộc thuần khiết từ thiên nhiên</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4 text-emerald-700 shrink-0" />
                      <span>Bảo mật dữ liệu chuẩn mã hóa SSL</span>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CheckoutView() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f7f5f0]" />}>
      <CheckoutContent />
    </Suspense>
  );
}

function InputField({
  id,
  name,
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
  id: string;
  name: string;
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
      <label htmlFor={id} className="block text-xs sm:text-sm font-bold text-forest-950 mb-1 sm:mb-1.5">
        {label}
        {required && <span className="text-red-600 font-bold ml-1">*</span>}
        {optional && <span className="text-[11px] sm:text-xs font-normal text-forest-600 ml-1.5">(Không bắt buộc)</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        inputMode={inputMode}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 sm:h-12 w-full rounded-xl sm:rounded-2xl border border-forest-800/25 bg-white px-3.5 sm:px-4 text-sm sm:text-base font-normal text-forest-950 placeholder:text-forest-400 placeholder:text-xs sm:placeholder:text-sm focus:border-forest-900 focus:ring-2 focus:ring-forest-800/20 focus:outline-none transition-all shadow-2xs"
      />
    </div>
  );
}
