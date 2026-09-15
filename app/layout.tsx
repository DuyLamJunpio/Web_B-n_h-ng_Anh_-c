import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { CartProvider } from "@/lib/CartContext";

const oswald = localFont({
  variable: "--font-oswald",
  display: "swap",
  src: [{ path: "./fonts/Oswald-VariableFont_wght.ttf", weight: "200 700", style: "normal" }],
});

export const metadata: Metadata = {
  title: "RUNGU | Hương thơm cho những ngày bình thường",
  description: "Vật phẩm mộc và hương thơm tự nhiên cho những khoảng lặng nhỏ trong ngày.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="scroll-smooth" data-scroll-behavior="smooth">
      <body
        className={`${oswald.variable} bg-linen-base text-forest-900 font-sans antialiased selection:bg-forest-700 selection:text-white min-h-screen flex flex-col justify-between overflow-x-hidden`}
      >
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>

  );
}
