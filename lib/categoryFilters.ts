import type { StorefrontCategory } from "./catalog";
import type { Product } from "./data";

/** Match a category and every nested category by its canonical slug. */
export function categoryAndDescendantSlugs(
  categories: readonly StorefrontCategory[],
  slug: string,
): Set<string> {
  const selected = categories.find((category) => category.slug === slug);
  if (!selected) return new Set();

  const ids = new Set([selected.id]);
  const slugs = new Set([selected.slug]);
  let foundChild = true;

  while (foundChild) {
    foundChild = false;
    for (const category of categories) {
      if (category.parent_id === null || !ids.has(category.parent_id) || ids.has(category.id)) continue;
      ids.add(category.id);
      slugs.add(category.slug);
      foundChild = true;
    }
  }

  return slugs;
}

export function countProductsInCategory(
  products: readonly Pick<Product, "category">[],
  categories: readonly StorefrontCategory[],
  slug: string,
): number {
  const slugs = categoryAndDescendantSlugs(categories, slug);
  return products.filter((product) => slugs.has(product.category)).length;
}
