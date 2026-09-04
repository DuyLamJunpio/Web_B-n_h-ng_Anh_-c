import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/CartContext";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["vietnamese", "latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["vietnamese", "latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Trầm & Khói | Trở Về Với Sự Tĩnh Tại",
  description: "Hành trình thanh tẩy không gian và làm dịu tâm trí",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="scroll-smooth">
      <body
        className={`${cormorant.variable} ${jakarta.variable} bg-linen-base text-forest-900 font-sans antialiased selection:bg-forest-700 selection:text-white min-h-screen flex flex-col justify-between overflow-x-hidden`}
      >
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>

  );
}
