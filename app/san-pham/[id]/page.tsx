import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductDetailView from "@/components/ProductDetailView";
import { getCatalogProduct, getCatalogProducts } from "@/lib/catalog";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getCatalogProduct(id);

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
  const product = await getCatalogProduct(id);

  if (!product) {
    notFound();
  }

  const products = await getCatalogProducts();
  const relatedProducts = products.filter((p) => p.id !== product.id && p.category === product.category);

  return (
    <>
      <Header />
      <ProductDetailView product={product} relatedProducts={relatedProducts} />
      <Footer />
    </>
  );
}
