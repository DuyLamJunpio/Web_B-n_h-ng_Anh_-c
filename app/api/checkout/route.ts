import { NextRequest, NextResponse } from "next/server";

// A checkout can legitimately take longer while Render is waking the QLBH
// service.  Keep the serverless function alive long enough to complete the
// safe retry sequence instead of returning an error after the first timeout.
export const maxDuration = 30;

type CheckoutItem = { variant_id: number; quantity: number };

function validItems(value: unknown): value is CheckoutItem[] {
  return Array.isArray(value)
    && value.length > 0
    && value.length <= 100
    && value.every((item) =>
      item !== null
      && typeof item === "object"
      && Number.isSafeInteger(item.variant_id)
      && item.variant_id > 0
      && Number.isInteger(item.quantity)
      && item.quantity >= 1
      && item.quantity <= 100,
    );
}

/** The browser never supplies prices or a payment confirmation. QLBH creates the order. */
export async function POST(request: NextRequest) {
  const apiUrl = (process.env.QLBH_API_URL || "https://api.rungu.com.vn").trim().replace(/\/+$/, "");
  const secret = process.env.WAREHOUSE_WEBHOOK_SECRET;

  if (!secret) {
    return NextResponse.json(
      { success: false, error: "Hệ thống đặt hàng chưa được kết nối. Vui lòng liên hệ cửa hàng." },
      { status: 503 },
    );
  }

  const input: unknown = await request.json().catch(() => null);
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return NextResponse.json({ success: false, error: "Dữ liệu đặt hàng không hợp lệ." }, { status: 400 });
  }

  const body = input as Record<string, unknown>;
  const voucherCode = typeof body.voucher_code === "string" ? body.voucher_code.trim().toUpperCase() : "";
  if (!validItems(body.items)
    || !["cod", "bank_transfer"].includes(String(body.payment_method))
    || typeof body.checkout_ref !== "string"
    || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(body.checkout_ref)
    || !Number.isSafeInteger(body.expected_total_amount)
    || Number(body.expected_total_amount) < 0
    || (voucherCode !== "" && !/^[A-Z0-9_-]{1,50}$/.test(voucherCode))) {
    return NextResponse.json(
      { success: false, error: "Giỏ hàng hoặc hình thức thanh toán không hợp lệ. Vui lòng tải lại trang." },
      { status: 400 },
    );
  }

  // Only send the fields QLBH accepts. Client prices, payment status and order IDs are ignored.
  const payload = {
    customer_name: body.customer_name,
    customer_phone: body.customer_phone,
    customer_email: body.customer_email || null,
    province: body.province,
    ward: body.ward,
    address: body.address,
    note: body.note || null,
    payment_method: body.payment_method,
    checkout_ref: body.checkout_ref,
    expected_total_amount: body.expected_total_amount,
    voucher_code: voucherCode || null,
    items: body.items,
  };

  /*
   * Render/reverse proxy có thể trả HTML hoặc body rỗng vài giây trong lúc
   * khởi động lại. Cùng checkout_ref được gửi lại nên QLBH sẽ trả đúng đơn đã
   * tạo, thay vì ghi thêm đơn hay tăng lượt dùng voucher.
   *
   * Mỗi lần gọi có giới hạn riêng. Trước đây request đầu dùng hết ngân sách
   * 15 giây, nên không còn thời gian thử lại: khách bấm lần hai thì API đã
   * thức dậy và mới thành công. Các lần dưới đây dùng cùng checkout_ref để
   * không tạo trùng đơn, đồng thời dành thời gian cho lần gọi tiếp theo.
   */
  const deadline = Date.now() + 27_000;
  const attempts = [
    { delayMs: 0, timeoutMs: 7_000 },
    { delayMs: 500, timeoutMs: 11_000 },
    { delayMs: 1_000, timeoutMs: 9_000 },
  ];
  let lastFailure: Record<string, unknown> | null = null;

  for (const [attemptIndex, attempt] of attempts.entries()) {
    if (attempt.delayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, attempt.delayMs));
    }

    const remainingMs = deadline - Date.now();
    if (remainingMs < 1_000) break;
    const timeoutMs = Math.min(attempt.timeoutMs, remainingMs);

    try {
      const response = await fetch(`${apiUrl}/api/checkout`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-Storefront-Secret": secret,
        },
        body: JSON.stringify(payload),
        cache: "no-store",
        signal: AbortSignal.timeout(timeoutMs),
      });

      const contentType = response.headers.get("content-type") || "";
      const rawResponse = await response.text();
      let result: unknown = null;
      try {
        result = rawResponse ? JSON.parse(rawResponse) : null;
      } catch {
        // Không ghi body vì trang lỗi từ proxy có thể chứa dữ liệu vận hành.
      }

      if (result && typeof result === "object") {
        return NextResponse.json(result, { status: response.status });
      }

      lastFailure = {
        kind: "non_json_response",
        attempt: attemptIndex + 1,
        status: response.status,
        contentType,
        bodyLength: rawResponse.length,
      };
    } catch (error) {
      lastFailure = {
        kind: "request_failed",
        attempt: attemptIndex + 1,
        error: error instanceof Error ? error.name : "unknown_error",
      };
    }
  }

  console.error("QLBH checkout did not return JSON after safe retries", lastFailure);

  return NextResponse.json(
    {
      success: false,
      error: "Chưa thể xác nhận trạng thái đơn hàng. Vui lòng thử lại sau ít phút; hệ thống sẽ không tạo trùng đơn.",
    },
    { status: 502 },
  );
}
