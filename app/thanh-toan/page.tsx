import type { Metadata } from "next";
import CheckoutView from "@/components/CheckoutView";

export const metadata: Metadata = {
  title: "Thanh toán đơn hàng | RUNGU",
  description: "Hoàn tất thông tin giao hàng và thanh toán các sản phẩm hương mộc tự nhiên từ RUNGU.",
};

export default function CheckoutPage() {
  return <CheckoutView />;
}
