import { NextRequest, NextResponse } from "next/server";

export async function GET(_request: NextRequest, context: { params: Promise<{ ref: string }> }) {
  const { ref } = await context.params;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(ref)) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
  const apiUrl = process.env.QLBH_API_URL?.replace(/\/+$/, "");
  const secret = process.env.WAREHOUSE_WEBHOOK_SECRET;
  if (!apiUrl || !secret) return NextResponse.json({ success: false }, { status: 503 });
  try {
    const response = await fetch(`${apiUrl}/api/checkout/status/${ref}`, {
      headers: { Accept: "application/json", "X-Storefront-Secret": secret },
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });
    const body = await response.json().catch(() => null);
    return NextResponse.json(body ?? { success: false }, { status: response.status });
  } catch {
    return NextResponse.json({ success: false }, { status: 502 });
  }
}
