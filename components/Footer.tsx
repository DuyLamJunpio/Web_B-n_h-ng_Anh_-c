"use client";

import { useState } from "react";
import { ArrowUpRight, Check, Send } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email) return;
    setEmail("");
    setSubscribed(true);
    window.setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <footer className="border-t border-[#282723]/15 bg-[#f3f1eb] px-5 pb-8 pt-16 text-[#282723] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid grid-cols-1 gap-12 border-b border-[#282723]/15 pb-16 lg:grid-cols-[1.35fr_0.8fr_0.8fr_1fr] lg:gap-16">
          <div>
            <p className="text-[32px] font-light tracking-[0.22em]">RUNGU</p>
            <p className="mt-5 max-w-sm text-sm leading-6 text-[#625f57]">Vật phẩm mộc và hương thơm tự nhiên cho những khoảng lặng nhỏ trong ngày.</p>
            <form onSubmit={handleSubscribe} className="mt-8 max-w-md">
              <label htmlFor="newsletter-email" className="text-xs font-medium">Nhận tin từ RUNGU</label>
              <div className="mt-3 flex items-center border-b border-[#282723]/35 pb-2 focus-within:border-[#8d693a]">
                <input id="newsletter-email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Địa chỉ email của bạn" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#77736b]" />
                <button type="submit" aria-label="Đăng ký nhận tin" className="text-[#625f57] transition-colors hover:text-[#8d693a]"><Send className="h-4 w-4" strokeWidth={1.25} /></button>
              </div>
              {subscribed && <p className="mt-3 flex items-center gap-2 text-xs text-[#66705a]"><Check className="h-3.5 w-3.5" />Cảm ơn bạn đã đăng ký.</p>}
            </form>
          </div>

          <div className="text-sm">
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em]">Vật phẩm</h2>
            <div className="mt-5 space-y-3 text-[#625f57]">
              <a href="#collections" className="footer-link">Gỗ Palo Santo</a>
              <a href="#collections" className="footer-link">Nến thơm</a>
              <a href="#collections" className="footer-link">Nhang trầm</a>
              <a href="#collections" className="footer-link">Đồ dùng nghi thức</a>
            </div>
          </div>

          <div className="text-sm">
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em]">Khám phá</h2>
            <div className="mt-5 space-y-3 text-[#625f57]">
              <a href="#collections" className="footer-link">Bộ sưu tập</a>
              <a href="#about" className="footer-link">Về RUNGU</a>
              <a href="#about" className="footer-link">Cửa hàng</a>
              <a href="#about" className="footer-link">Chăm sóc khách hàng</a>
            </div>
          </div>

          <div className="text-sm">
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em]">Liên hệ</h2>
            <div className="mt-5 space-y-3 text-[#625f57]">
              <p>hello@rungu.vn</p>
              <p>0868 238 690</p>
              <p>Hoàn Kiếm, Hà Nội</p>
              <a href="#about" className="inline-flex items-center gap-2 pt-2 text-[#282723] transition-colors hover:text-[#8d693a]">Theo dõi chúng tôi <ArrowUpRight className="h-4 w-4" strokeWidth={1.25} /></a>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-7 text-[11px] text-[#77736b] sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} RUNGU. Tất cả quyền được bảo lưu.</span>
          <div className="flex gap-5"><a href="#about" className="footer-link">Chính sách riêng tư</a><a href="#about" className="footer-link">Điều khoản</a></div>
        </div>
      </div>
    </footer>
  );
}
