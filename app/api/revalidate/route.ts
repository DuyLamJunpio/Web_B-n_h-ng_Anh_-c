import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

const CATALOG_TAG = "rungu-catalog";

/** Nhận tín hiệu từ QLBH sau khi catalogue thay đổi. */
export async function POST(request: NextRequest) {
  const secret = process.env.WAREHOUSE_WEBHOOK_SECRET;
  const suppliedSecret = request.headers.get("X-Warehouse-Secret");

  if (!secret || suppliedSecret !== secret) {
    return NextResponse.json({ error: "Không được phép." }, { status: 401 });
  }

  revalidateTag(CATALOG_TAG, { expire: 0 });

  return NextResponse.json({ revalidated: true, at: Date.now() });
}
