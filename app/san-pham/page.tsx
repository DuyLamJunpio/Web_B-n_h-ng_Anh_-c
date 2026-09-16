import { Suspense } from "react";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ShopAllPLP from "@/components/ShopAllPLP";

export const metadata: Metadata = {
  title: "Tất cả sản phẩm | RUNGU",
  description: "Các công thức mộc mạc và hương thơm tự nhiên từ RUNGU. Tuyển chọn từ gỗ Palo Santo, xô thơm và nhang trầm tự nhiên.",
};

export default function SanPhamPage() {
  return (
    <>
      <Header />
      <Suspense fallback={<div className="min-h-screen bg-[#f3f0e8]" />}>
        <ShopAllPLP />
      </Suspense>
      <Footer />
    </>
  );
}
