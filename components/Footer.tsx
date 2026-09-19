"use client";

import { useState } from "react";
import Link from "next/link";
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
    <footer id="contact" className="scroll-mt-12 border-t border-[#282723]/15 bg-[#f3f1eb] px-5 pb-8 pt-16 text-[#282723] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid grid-cols-1 gap-12 border-b border-[#282723]/15 pb-16 lg:grid-cols-[1.35fr_0.8fr_0.8fr_1fr] lg:gap-16">
          <div>
            <p className="text-4xl font-normal tracking-[0.22em] text-[#282723]">RUNGU</p>
            <p className="mt-5 max-w-sm text-base leading-relaxed text-[#504c44]">Vật phẩm mộc và hương thơm tự nhiên cho những khoảng lặng nhỏ trong ngày.</p>
            <form onSubmit={handleSubscribe} className="mt-8 max-w-md">
              <label htmlFor="newsletter-email" className="text-sm font-semibold text-[#282723]">Nhận tin từ RUNGU</label>
              <div className="mt-3 flex items-center border-b border-[#282723]/35 pb-2 focus-within:border-[#8d693a]">
                <input id="newsletter-email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Địa chỉ email của bạn" className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-[#77736b]" />
                <button type="submit" aria-label="Đăng ký nhận tin" className="text-[#625f57] transition-colors hover:text-[#8d693a]"><Send className="h-4 w-4" strokeWidth={1.25} /></button>
              </div>
              {subscribed && <p className="mt-3 flex items-center gap-2 text-sm text-[#4e5a42]"><Check className="h-4 w-4" />Cảm ơn bạn đã đăng ký.</p>}
            </form>
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-[#282723]">Vật phẩm</h2>
            <div className="mt-5 space-y-3.5 text-[#504c44]">
              <Link href="/san-pham?category=purify" className="footer-link block hover:text-[#282723]">Gỗ Palo Santo</Link>
              <Link href="/san-pham?category=warmth" className="footer-link block hover:text-[#282723]">Nến thơm sáp tự nhiên</Link>
              <Link href="/san-pham?category=purify" className="footer-link block hover:text-[#282723]">Nhang trầm Quảng Nam</Link>
              <Link href="/san-pham?category=warmth" className="footer-link block hover:text-[#282723]">Khay gốm Bát Tràng</Link>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-[#282723]">Khám phá</h2>
            <div className="mt-5 space-y-3.5 text-[#504c44]">
              <Link href="/san-pham" className="footer-link block hover:text-[#282723]">Tất cả sản phẩm</Link>
              <Link href="/#about" className="footer-link block hover:text-[#282723]">Về RUNGU</Link>
              <Link href="/#stories" className="footer-link block hover:text-[#282723]">Thư viện câu chuyện</Link>
              <Link href="/#contact" className="footer-link block hover:text-[#282723]">Chăm sóc khách hàng</Link>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-[#282723]">Liên hệ</h2>
            <div className="mt-5 space-y-3.5 text-[#504c44]">
              <p>hello@rungu.vn</p>
              <p>0868 238 690</p>
              <p>Hoàn Kiếm, Hà Nội</p>
              <a href="#contact" className="inline-flex items-center gap-2 pt-2 text-base font-medium text-[#282723] transition-colors hover:text-[#8d693a]">Tư vấn trực tiếp <ArrowUpRight className="h-4 w-4" strokeWidth={1.25} /></a>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-7 text-xs sm:text-sm text-[#77736b] sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} RUNGU. Tất cả quyền được bảo lưu.</span>
          <div className="flex gap-6"><a href="#about" className="footer-link">Chính sách riêng tư</a><a href="#about" className="footer-link">Điều khoản</a></div>
        </div>
      </div>
    </footer>
  );
}
