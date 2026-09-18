import "server-only";

import { PRODUCTS, type Product } from "@/lib/data";

type StorefrontProduct = {
  id: number | string;
  slug?: string;
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
  manage_stock?: boolean;
  variants?: Array<{
    id: number | string;
    size?: string | null;
    color?: string | null;
    sku?: string | null;
    stock?: number;
    available?: boolean;
    price?: number;
  }>;
};

type StorefrontResponse = { products?: StorefrontProduct[] };

export type SalesMethod = {
  enabled: boolean;
  free_shipping: boolean;
  shipping_fee: number;
  free_shipping_min_items: number | null;
};

export type StorefrontContent = {
  banners: Array<{
    id: number;
    media: string;
    media_type: "image" | "video";
    poster?: string | null;
    mobile?: string | null;
    alt?: string | null;
    heading?: string | null;
    subheading?: string | null;
    cta_label?: string | null;
    cta_link?: string | null;
  }>;
  collections: Array<{
    id: number;
    title: string;
    subtitle?: string | null;
    image?: string | null;
    cta_label?: string | null;
    cta_link?: string | null;
    product_slugs: string[];
  }>;
  announcement: string[];
  headings: Record<string, string>;
  sales: Record<string, SalesMethod>;
};

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
    slug: product.slug,
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
    manageStock: Boolean(product.manage_stock),
    inStock: product.in_stock !== false,
    variants: (product.variants ?? []).map((variant) => {
      const label = [variant.size, variant.color].filter(Boolean).join(" / ") || variant.sku || "Mặc định";

      return {
        id: String(variant.id),
        label,
        size: variant.size,
        color: variant.color,
        sku: variant.sku,
        stock: Number(variant.stock) || 0,
        available: variant.available !== false,
        price: Number(variant.price) || Number(product.price) || 0,
      };
    }),
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

/** Nội dung và chính sách bán hàng được quản trị từ QLBH. */
export async function getStorefrontContent(): Promise<StorefrontContent> {
  const apiUrl = process.env.QLBH_API_URL?.replace(/\/+$/, "");
  const fallback: StorefrontContent = {
    banners: [],
    collections: [],
    announcement: [],
    headings: {},
    sales: {
      cod: { enabled: true, free_shipping: true, shipping_fee: 0, free_shipping_min_items: null },
      bank_transfer: { enabled: true, free_shipping: true, shipping_fee: 0, free_shipping_min_items: null },
    },
  };

  if (!apiUrl) return fallback;

  try {
    const response = await fetch(`${apiUrl}/api/storefront/content`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 60, tags: [CATALOG_TAG] },
    });

    if (!response.ok) return fallback;
    const payload = (await response.json()) as Partial<StorefrontContent>;

    return {
      banners: (payload.banners ?? []).map((banner) => ({
        ...banner,
        media: imageUrl(banner.media, apiUrl),
        poster: banner.poster ? imageUrl(banner.poster, apiUrl) : null,
        mobile: banner.mobile ? imageUrl(banner.mobile, apiUrl) : null,
      })),
      collections: (payload.collections ?? []).map((collection) => ({
        ...collection,
        image: collection.image ? imageUrl(collection.image, apiUrl) : null,
      })),
      announcement: payload.announcement ?? [],
      headings: payload.headings ?? {},
      sales: Object.keys(payload.sales ?? {}).length ? payload.sales! : fallback.sales,
    };
  } catch {
    return fallback;
  }
}
