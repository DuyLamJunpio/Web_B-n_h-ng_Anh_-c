import "server-only";

import { PRODUCTS, type Product } from "@/lib/data";

type StorefrontProduct = {
  id: number | string;
  slug?: string;
  name?: string;
  category?: string;
  category_slug?: string | null;
  category_id?: number | string | null;
  description?: string | null;
  material?: string | null;
  brand?: string | null;
  is_new?: boolean;
  is_featured?: boolean;
  created_at?: string | null;
  price?: number;
  compare_price?: number | null;
  sold?: number;
  in_stock?: boolean;
  total_stock?: number;
  images?: string[];
  videos?: string[];
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

type StorefrontResponse = { products?: StorefrontProduct[]; categories?: StorefrontCategory[] };

export type StorefrontCategory = {
  id: number;
  name: string;
  slug: string;
  parent_id: number | null;
  image: string | null;
  count: number;
  description?: string | null;
};

type StorefrontCategoriesResponse = { categories?: StorefrontCategory[] };

export type SalesMethod = {
  enabled: boolean;
  free_shipping: boolean;
  shipping_fee: number;
  free_shipping_min_items: number | null;
  bank?: { code: string; account_number: string; account_name: string } | null;
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

const FALLBACK_CATEGORIES: StorefrontCategory[] = [
  { id: -1, name: "Sáng tạo", slug: "sang-tao", parent_id: null, image: null, count: 0, description: "Tác phẩm nghệ nhân và sáng tạo độc bản" },
  { id: -2, name: "Hương thơm", slug: "huong-thom", parent_id: null, image: null, count: 0, description: "Nến thơm tự nhiên và xô thơm thảo mộc" },
  { id: -3, name: "Gỗ hoa cỏ", slug: "go-hoa-co", parent_id: null, image: null, count: 0, description: "Gỗ thánh Palo Santo và trầm nén tự nhiên" },
  { id: -4, name: "Đất và Đá", slug: "dat-va-da", parent_id: null, image: null, count: 0, description: "Khay gốm thủ công men tro nung củi nhiệt cao" },
  { id: -5, name: "Phụ kiện", slug: "phu-kien", parent_id: null, image: null, count: 0, description: "Vòng tay bách xanh và dụng cụ nghi thức mộc" },
  { id: -6, name: "Quà tặng", slug: "qua-tang", parent_id: null, image: null, count: 0, description: "Những hộp quà trang nhã gói ghém sự an yên" },
];

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

function orderCategories(categories: StorefrontCategory[]): StorefrontCategory[] {
  const childrenByParent = new Map<number, StorefrontCategory[]>();
  for (const category of categories) {
    if (category.parent_id === null) continue;
    const siblings = childrenByParent.get(category.parent_id) ?? [];
    siblings.push(category);
    childrenByParent.set(category.parent_id, siblings);
  }

  const ordered: StorefrontCategory[] = [];
  const visited = new Set<number>();
  const visit = (category: StorefrontCategory) => {
    if (visited.has(category.id)) return;
    visited.add(category.id);
    ordered.push(category);
    for (const child of childrenByParent.get(category.id) ?? []) visit(child);
  };

  for (const category of categories) {
    if (category.parent_id === null) visit(category);
  }
  for (const category of categories) visit(category);
  return ordered;
}

function toProduct(product: StorefrontProduct, apiUrl: string, categorySlugs: Map<string, string>): Product {
  const categoryName = product.category?.trim() || "Sản phẩm khác";
  const categorySlug = product.category_slug?.trim()
    || categorySlugs.get(`id:${product.category_id}`)
    || categorySlugs.get(`name:${categoryName.toLocaleLowerCase("vi")}`)
    || slugify(categoryName);
  const description = product.description?.trim() || "Thông tin sản phẩm đang được RỪNG U cập nhật.";
  const material = product.material?.trim() || "";
  const gallery = (product.images ?? []).map((image) => imageUrl(image, apiUrl));
  const videos = (product.videos ?? []).map((video) => imageUrl(video, apiUrl));
  const variants = (product.variants ?? []).map((variant) => {
    const label = [variant.size, variant.color].filter(Boolean).join(" / ") || variant.sku || "Mặc định";

    return {
      id: String(variant.id),
      label,
      size: variant.size,
      color: variant.color,
      sku: variant.sku,
      stock: Number(variant.stock) || 0,
      available: variant.available !== false,
      price: Number(variant.price ?? product.price ?? 0),
    };
  });
  const basePrice = Number(product.price) || 0;
  const displayPrice = variants.find((variant) => variant.available)?.price ?? basePrice;

  return {
    id: String(product.id),
    slug: product.slug,
    isNew: Boolean(product.is_new),
    isFeatured: Boolean(product.is_featured),
    soldCount: Number(product.sold) || 0,
    createdAt: product.created_at || undefined,
    name: product.name?.trim() || "Sản phẩm RỪNG U",
    category: categorySlug,
    categoryName,
    price: displayPrice,
    originalPrice: displayPrice === basePrice && product.compare_price ? Number(product.compare_price) : undefined,
    rating: 0,
    reviewsCount: 0,
    badge: product.is_new ? "Mới về" : product.is_featured ? "Được chọn" : undefined,
    notes: material,
    origin: product.brand?.trim() || "",
    image: gallery[0] || "/generated-hero.png",
    gallery: gallery.length ? gallery : ["/generated-hero.png"],
    videos,
    desc: description,
    detail: description,
    benefits: [],
    usage: "",
    manageStock: Boolean(product.manage_stock),
    inStock: product.in_stock !== false,
    variants,
  };
}

/** Trang chi tiết đọc trực tiếp giá và tồn kho của một sản phẩm theo ID/slug. */
export async function getCatalogProduct(idOrSlug: string): Promise<Product | null> {
  const apiUrl = process.env.QLBH_API_URL?.replace(/\/+$/, "");
  if (!apiUrl) return PRODUCTS.find((product) => product.id === idOrSlug || product.slug === idOrSlug) ?? null;

  try {
    const response = await fetch(`${apiUrl}/api/storefront/products/${encodeURIComponent(idOrSlug)}`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!response.ok) return null;
    const product = (await response.json()) as StorefrontProduct;
    return toProduct(product, apiUrl, new Map());
  } catch {
    return null;
  }
}

/** Lấy catalogue từ QLBH; dữ liệu mẫu chỉ dùng khi chưa cấu hình API. */
export async function getCatalogProducts(): Promise<Product[]> {
  const apiUrl = process.env.QLBH_API_URL?.replace(/\/+$/, "");
  if (!apiUrl) return PRODUCTS;

  try {
    const response = await fetch(`${apiUrl}/api/storefront/products`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 60, tags: [CATALOG_TAG] },
    });

    if (!response.ok) return [];
    const payload = (await response.json()) as StorefrontResponse;
    const categorySlugs = new Map<string, string>();
    for (const category of Array.isArray(payload.categories) ? payload.categories : []) {
      categorySlugs.set(`id:${category.id}`, category.slug);
      categorySlugs.set(`name:${category.name.toLocaleLowerCase("vi")}`, category.slug);
    }
    const products = payload.products?.map((product) => toProduct(product, apiUrl, categorySlugs)) ?? [];

    return products;
  } catch {
    return [];
  }
}

/** Danh mục chuẩn được quản trị trong QLBH, bao gồm cả danh mục chưa có sản phẩm. */
export async function getStorefrontCategories(): Promise<StorefrontCategory[]> {
  const fallback = FALLBACK_CATEGORIES.map((category) => ({
    ...category,
    count: PRODUCTS.filter((product) => product.category === category.slug).length,
  }));
  const apiUrl = process.env.QLBH_API_URL?.replace(/\/+$/, "");
  if (!apiUrl) return fallback;

  try {
    const response = await fetch(`${apiUrl}/api/storefront/categories`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 60, tags: [CATALOG_TAG] },
    });
    if (!response.ok) return fallback;

    const payload = (await response.json()) as StorefrontCategoriesResponse;
    if (!Array.isArray(payload.categories)) return fallback;

    return orderCategories(payload.categories
      .filter((category) => category && typeof category.slug === "string" && typeof category.name === "string")
      .map((category) => ({
        id: Number(category.id),
        name: category.name,
        slug: category.slug,
        parent_id: category.parent_id == null ? null : Number(category.parent_id),
        image: category.image ? imageUrl(category.image, apiUrl) : null,
        count: Number(category.count) || 0,
        description: category.description || fallback.find((item) => item.slug === category.slug)?.description || null,
      })));
  } catch {
    return fallback;
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
