import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductDetailView from "@/components/ProductDetailView";
import { getCatalogProducts } from "@/lib/catalog";
import { PRODUCTS } from "@/lib/data";

export async function generateStaticParams() {
  const catalogProducts = await getCatalogProducts();
  const allProducts = Array.from(
    new Map([...PRODUCTS, ...catalogProducts].map((p) => [p.id, p])).values()
  );
  return allProducts.map((product) => ({ id: product.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const products = await getCatalogProducts();
  const product = products.find((p) => p.id === id) || PRODUCTS.find((p) => p.id === id);

  if (!product) {
    return {
      title: "Sản phẩm không tìm thấy | RUNGU",
      description: "Không tìm thấy thông tin sản phẩm yêu cầu.",
    };
  }

  return {
    title: `${product.name} | RUNGU`,
    description: product.desc,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const products = await getCatalogProducts();
  const product = products.find((p) => p.id === id) || PRODUCTS.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  const allList = products.some((p) => p.id === product.id) ? products : PRODUCTS;
  const relatedProducts = allList.filter((p) => p.id !== product.id);

  return (
    <>
      <Header />
      <ProductDetailView product={product} relatedProducts={relatedProducts} />
      <Footer />
    </>
  );
}
