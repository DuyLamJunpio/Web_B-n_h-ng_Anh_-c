import { NextRequest, NextResponse } from "next/server";

/** Recheck stock, price and shipping with QLBH before asking the customer to confirm. */
export async function POST(request: NextRequest) {
  const apiUrl = process.env.QLBH_API_URL?.replace(/\/+$/, "");
  const secret = process.env.WAREHOUSE_WEBHOOK_SECRET;
  if (!apiUrl || !secret) {
    return NextResponse.json(
      { ok: false, error: "Hệ thống đặt hàng chưa được kết nối. Vui lòng liên hệ cửa hàng." },
      { status: 503 },
    );
  }

  const input: unknown = await request.json().catch(() => null);
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return NextResponse.json({ ok: false, error: "Dữ liệu giỏ hàng không hợp lệ." }, { status: 400 });
  }
  const body = input as Record<string, unknown>;
  const items = body.items;
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
    || !["cod", "bank_transfer"].includes(String(body.payment_method))) {
    return NextResponse.json(
      { ok: false, error: "Giỏ hàng hoặc hình thức thanh toán không hợp lệ. Vui lòng tải lại trang." },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(`${apiUrl}/api/checkout/quote`, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ payment_method: body.payment_method, items }),
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });
    const result = await response.json().catch(() => null);
    if (!result || typeof result !== "object") {
      return NextResponse.json(
        { ok: false, error: "Không kiểm tra được giá và tồn kho lúc này." },
        { status: 502 },
      );
    }
    return NextResponse.json(result, { status: response.status });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Không kết nối được kho hàng. Vui lòng thử lại sau ít phút." },
      { status: 502 },
    );
  }
}
