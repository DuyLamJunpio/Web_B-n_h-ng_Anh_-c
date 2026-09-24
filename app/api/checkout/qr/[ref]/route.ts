import { NextRequest, NextResponse } from "next/server";

export async function GET(_request: NextRequest, context: { params: Promise<{ ref: string }> }) {
  const { ref } = await context.params;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(ref)) {
    return NextResponse.json({ error: "Mã yêu cầu không hợp lệ." }, { status: 400 });
  }

  const apiUrl = (process.env.QLBH_API_URL || "https://api.rungu.com.vn").trim().replace(/\/+$/, "");
  const secret = process.env.WAREHOUSE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Hệ thống thanh toán chưa được cấu hình." }, { status: 503 });
  }

  try {
    const response = await fetch(`${apiUrl}/api/checkout/status/${ref}/qr`, {
      headers: { Accept: "image/png", "X-Storefront-Secret": secret },
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      return NextResponse.json({ error: payload?.error || "Chưa thể tạo mã QR." }, { status: response.status });
    }

    return new NextResponse(await response.arrayBuffer(), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "private, no-store, max-age=0",
      },
    });
  } catch {
    return NextResponse.json({ error: "Không kết nối được hệ thống tạo mã QR." }, { status: 502 });
  }
}
