import { NextRequest, NextResponse } from "next/server";

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
      signal: AbortSignal.timeout(15000),
    });

    const contentType = response.headers.get("content-type") || "";
    const rawResponse = await response.text();
    let result: unknown = null;
    try {
      result = rawResponse ? JSON.parse(rawResponse) : null;
    } catch {
      // Render/proxy có thể trả một trang HTML khi API đang khởi động lại hoặc
      // gặp lỗi 5xx. Không ghi body vì có thể chứa dữ liệu vận hành nhạy cảm.
      console.error("QLBH checkout returned a non-JSON response", {
        status: response.status,
        contentType,
        bodyLength: rawResponse.length,
      });
    }
    if (!result || typeof result !== "object") {
      return NextResponse.json(
        {
          success: false,
          error: "Chưa thể xác nhận trạng thái đơn hàng. Vui lòng thử lại sau ít phút; hệ thống sẽ không tạo trùng đơn.",
        },
        { status: 502 },
      );
    }
    return NextResponse.json(result, { status: response.status });
  } catch {
    return NextResponse.json(
      { success: false, error: "Không kết nối được hệ thống đặt hàng. Vui lòng thử lại sau ít phút." },
      { status: 502 },
    );
  }
}
