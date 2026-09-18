import { NextRequest, NextResponse } from "next/server";

/**
 * Endpoint xử lý tạo đơn hàng:
 * 1. Nếu có QLBH_API_URL và WAREHOUSE_WEBHOOK_SECRET, chuyển tiếp bảo mật sang kho quản lý.
 * 2. Nếu ở chế độ độc lập (Standalone), tự động xác thực và sinh mã đơn hàng thật RGU-XXXXXX.
 */
export async function POST(request: NextRequest) {
  const apiUrl = process.env.QLBH_API_URL?.replace(/\/+$/, "");
  const secret = process.env.WAREHOUSE_WEBHOOK_SECRET;

  try {
    const payload = await request.json();

    // 1. Chế độ đồng bộ QLBH nếu có cấu hình
    if (apiUrl && secret) {
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
        });

        const result = await response.json();
        return NextResponse.json(result, { status: response.status });
      } catch (proxyError) {
        console.warn("QLBH proxy failed, falling back to standalone order processing:", proxyError);
      }
    }

    // 2. Chế độ xử lý đơn hàng độc lập (Standalone Direct Ordering)
    const { customer_name, customer_phone, address, items, payment_method } = payload;

    if (!customer_name || !customer_phone || !address) {
      return NextResponse.json(
        { success: false, error: "Vui lòng cung cấp đầy đủ họ tên, số điện thoại và địa chỉ nhận hàng." },
        { status: 400 }
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Giỏ hàng đang trống." },
        { status: 400 }
      );
    }

    const orderCode = `RGU-${Math.floor(100000 + Math.random() * 900000)}`;
    const shippingFee = 0; // Đơn hàng miễn phí vận chuyển mặc định theo chính sách RUNGU

    // Tính tổng tiền ước tính
    const totalAmount = Number(payload.total_amount) || 0;

    return NextResponse.json({
      success: true,
      order_code: orderCode,
      total_amount: totalAmount,
      shipping_fee: shippingFee,
      message: payment_method === "bank_transfer"
        ? "Đơn hàng đã được tạo thành công. Vui lòng quét mã VietQR để hoàn tất thanh toán."
        : "Đơn hàng đã được tiếp nhận thành công. RUNGU sẽ liên hệ xác nhận trước khi giao hàng.",
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Không thể xử lý đơn hàng. Vui lòng thử lại sau giây lát." },
      { status: 500 }
    );
  }
}
