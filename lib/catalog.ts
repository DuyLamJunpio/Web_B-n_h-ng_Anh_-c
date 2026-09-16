import "server-only";

import { PRODUCTS, type Product } from "@/lib/data";

type StorefrontProduct = {
  id: number | string;
  name?: string;
  category?: string;
  description?: string | null;
  material?: string | null;
  brand?: string | null;
  is_new?: boolean;
  is_featured?: boolean;
  price?: number;
  compare_price?: number | null;
  sold?: number;
  in_stock?: boolean;
  total_stock?: number;
  images?: string[];
};

type StorefrontResponse = { products?: StorefrontProduct[] };

const CATALOG_TAG = "rungu-catalog";

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "khac";
}

function imageUrl(path: string | undefined, apiUrl: string): string {
  if (!path) return "/generated-hero.png";
  if (/^https?:\/\//i.test(path)) return path;
  return new URL(path, `${apiUrl}/`).toString();
}

function toProduct(product: StorefrontProduct, apiUrl: string): Product {
  const categoryName = product.category?.trim() || "Sản phẩm khác";
  const description = product.description?.trim() || "Thông tin sản phẩm đang được RỪNG U cập nhật.";
  const material = product.material?.trim() || product.brand?.trim() || "Sản phẩm mộc được RỪNG U tuyển chọn";
  const gallery = (product.images ?? []).map((image) => imageUrl(image, apiUrl));

  return {
    id: String(product.id),
    name: product.name?.trim() || "Sản phẩm RỪNG U",
    category: slugify(categoryName),
    categoryName,
    price: Number(product.price) || 0,
    originalPrice: product.compare_price ? Number(product.compare_price) : undefined,
    rating: 5,
    reviewsCount: Number(product.sold) || 0,
    badge: product.is_new ? "Mới về" : product.is_featured ? "Được chọn" : undefined,
    notes: material,
    scentPyramid: {
      top: material,
      middle: product.brand?.trim() || categoryName,
      base: product.in_stock === false ? "Tạm hết hàng" : "Sẵn sàng phục vụ",
    },
    origin: product.brand?.trim() || "RỪNG U tuyển chọn",
    image: gallery[0] || "/generated-hero.png",
    gallery: gallery.length ? gallery : ["/generated-hero.png"],
    desc: description,
    detail: description,
    benefits: product.in_stock === false
      ? ["Sản phẩm đang tạm hết hàng"]
      : ["Sản phẩm đang có hàng", `Tồn kho hiển thị: ${Number(product.total_stock) || 0}`],
    usage: "Xem hướng dẫn sử dụng và bảo quản trong phần mô tả sản phẩm.",
  };
}

/** Lấy catalogue từ QLBH; vẫn hiển thị dữ liệu mẫu nếu API chưa được cấu hình. */
export async function getCatalogProducts(): Promise<Product[]> {
  const apiUrl = process.env.QLBH_API_URL?.replace(/\/+$/, "");
  if (!apiUrl) return PRODUCTS;

  try {
    const response = await fetch(`${apiUrl}/api/storefront/products`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 60, tags: [CATALOG_TAG] },
    });

    if (!response.ok) return PRODUCTS;
    const payload = (await response.json()) as StorefrontResponse;
    const products = payload.products?.map((product) => toProduct(product, apiUrl)) ?? [];

    return products.length ? products : PRODUCTS;
  } catch {
    return PRODUCTS;
  }
}
