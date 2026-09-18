import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { CartProvider } from "@/lib/CartContext";
import { getCatalogProducts, getStorefrontContent } from "@/lib/catalog";

const cormorantGaramond = localFont({
  variable: "--font-cormorant",
  display: "swap",
  src: [
    { path: "./fonts/Cormorant-Garamond-Variable.ttf", weight: "300 700", style: "normal" },
    { path: "./fonts/Cormorant-Garamond-Italic-Variable.ttf", weight: "300 700", style: "italic" },
  ],
});

export const metadata: Metadata = {
  title: "RUNGU | Ngàn lẻ một câu chuyện về những nốt hương",
  description: "Vật phẩm mộc và hương thơm tự nhiên cho những khoảng lặng nhỏ trong ngày.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [products, storefrontContent] = await Promise.all([
    getCatalogProducts(),
    getStorefrontContent(),
  ]);

  return (
    <html lang="vi" className="scroll-smooth" data-scroll-behavior="smooth">
      <body
        className={`${cormorantGaramond.variable} bg-linen-base text-forest-900 font-sans antialiased selection:bg-forest-700 selection:text-white min-h-screen flex flex-col justify-between overflow-x-hidden`}
      >
        <CartProvider products={products} storefrontContent={storefrontContent}>
          {children}
        </CartProvider>
      </body>
    </html>

  );
}
