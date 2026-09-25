import { NextRequest, NextResponse } from "next/server";

// Keep the quote request alive while the QLBH service is waking. This is the
// preflight for checkout, so a transient startup response must not make the
// customer reopen the form or click the payment button twice.
export const maxDuration = 30;

/** Recheck stock, price and shipping with QLBH before asking the customer to confirm. */
export async function POST(request: NextRequest) {
  const apiUrl = (process.env.QLBH_API_URL || "https://api.rungu.com.vn").trim().replace(/\/+$/, "");

  const input: unknown = await request.json().catch(() => null);
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return NextResponse.json({ ok: false, error: "Dữ liệu giỏ hàng không hợp lệ." }, { status: 400 });
  }
  const body = input as Record<string, unknown>;
  const items = body.items;
  const voucherCode = typeof body.voucher_code === "string" ? body.voucher_code.trim().toUpperCase() : "";
  if (!Array.isArray(items)
    || items.length === 0
    || items.length > 100
    || !items.every((item) => item
      && typeof item === "object"
      && Number.isSafeInteger(item.variant_id)
      && item.variant_id > 0
      && Number.isInteger(item.quantity)
      && item.quantity >= 1
      && item.quantity <= 100)
    || !["cod", "bank_transfer"].includes(String(body.payment_method))
    || (voucherCode !== "" && !/^[A-Z0-9_-]{1,50}$/.test(voucherCode))) {
    return NextResponse.json(
      { ok: false, error: "Giỏ hàng hoặc hình thức thanh toán không hợp lệ. Vui lòng tải lại trang." },
      { status: 400 },
    );
  }

  const payload = JSON.stringify({
    payment_method: body.payment_method,
    items,
    voucher_code: voucherCode || null,
  });
  const deadline = Date.now() + 27_000;

  for (const attempt of [
    { delayMs: 0, timeoutMs: 7_000 },
    { delayMs: 500, timeoutMs: 11_000 },
    { delayMs: 1_000, timeoutMs: 9_000 },
  ]) {
    if (attempt.delayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, attempt.delayMs));
    }
    const remainingMs = deadline - Date.now();
    if (remainingMs < 1_000) break;

    try {
      const response = await fetch(`${apiUrl}/api/checkout/quote`, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: payload,
        cache: "no-store",
        signal: AbortSignal.timeout(Math.min(attempt.timeoutMs, remainingMs)),
      });
      const result = await response.json().catch(() => null);
      if (result && typeof result === "object") {
        return NextResponse.json(result, { status: response.status });
      }
    } catch {
      // Lần kế tiếp dùng cùng payload nên quote luôn an toàn để thử lại.
    }
  }

  return NextResponse.json(
    { ok: false, error: "Kho hàng đang khởi động. Vui lòng giữ nguyên biểu mẫu, hệ thống sẽ sẵn sàng trong ít phút." },
    { status: 503 },
  );
}
