"use client";

import { useState } from "react";
import { Sparkles, ArrowRight, Check, Heart, Shield, RefreshCw, Send } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="bg-forest-950 border-t border-forest-800/40 pt-20 pb-12 px-4 sm:px-8 lg:px-12 xl:px-16 relative z-10 w-full overflow-hidden text-stone-200">
      {/* 4 Trust Highlights before footer links Spanning Full 1400px Width */}
      <div className="max-w-[1400px] mx-auto pb-16 mb-16 border-b border-forest-800/40 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="flex items-start gap-4 p-5 rounded-2xl bg-forest-900/60 border border-forest-800/60 hover:border-forest-600/40 transition-colors">
          <div className="w-10 h-10 rounded-full bg-forest-800/50 border border-forest-700/50 flex items-center justify-center text-forest-300 flex-shrink-0 shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-serif text-forest-50 text-base font-normal">Thuần Khiết Tự Nhiên</h4>
            <p className="text-stone-300/80 text-xs font-light mt-1 leading-relaxed">Không hương liệu tổng hợp, giữ trọn vẹn tinh chất mộc mạc của đất trời.</p>
          </div>
        </div>

        <div className="flex items-start gap-4 p-5 rounded-2xl bg-forest-900/60 border border-forest-800/60 hover:border-forest-600/40 transition-colors">
          <div className="w-10 h-10 rounded-full bg-forest-800/50 border border-forest-700/50 flex items-center justify-center text-forest-300 flex-shrink-0 shadow-md">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-serif text-forest-50 text-base font-normal">Khai Thác Bền Vững</h4>
            <p className="text-stone-300/80 text-xs font-light mt-1 leading-relaxed">Gỗ Palo Santo rụng tự nhiên từ Peru, đạt chuẩn bảo tồn rừng nguyên sinh.</p>
          </div>
        </div>

        <div className="flex items-start gap-4 p-5 rounded-2xl bg-forest-900/60 border border-forest-800/60 hover:border-forest-600/40 transition-colors">
          <div className="w-10 h-10 rounded-full bg-forest-800/50 border border-forest-700/50 flex items-center justify-center text-forest-300 flex-shrink-0 shadow-md">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-serif text-forest-50 text-base font-normal">Đổi Trả An Tâm</h4>
            <p className="text-stone-300/80 text-xs font-light mt-1 leading-relaxed">Hỗ trợ đổi trả miễn phí trong 7 ngày nếu không hợp mùi hương tự nhiên.</p>
          </div>
        </div>

        <div className="flex items-start gap-4 p-5 rounded-2xl bg-forest-900/60 border border-forest-800/60 hover:border-forest-600/40 transition-colors">
          <div className="w-10 h-10 rounded-full bg-forest-800/50 border border-forest-700/50 flex items-center justify-center text-forest-300 flex-shrink-0 shadow-md">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-serif text-forest-50 text-base font-normal">Đóng Gói Chánh Niệm</h4>
            <p className="text-stone-300/80 text-xs font-light mt-1 leading-relaxed">Xông thảo mộc từng đơn hàng và gói giấy mộc phân huỷ sinh học.</p>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
        {/* Brand & Newsletter */}
        <div className="md:col-span-5 space-y-5">
          <div>
            <span className="font-serif text-3xl sm:text-4xl text-forest-50 tracking-[0.2em] block">
              TRẦM & KHÓI
            </span>
            <span className="text-[10px] uppercase tracking-[0.35em] text-forest-300 block font-sans font-semibold mt-1">
              Aura & Natural Rituals
            </span>
          </div>

          <p className="text-stone-300/80 font-light text-xs sm:text-sm max-w-md leading-relaxed">
            Đăng ký nhận những bản tin về nghệ thuật không gian xanh, thông điệp an yên và ưu đãi dành riêng cho thành viên tĩnh tâm hàng tuần.
          </p>

          <form onSubmit={handleSubscribe} className="space-y-2 max-w-md">
            <div className="flex items-center border-b border-forest-700/80 focus-within:border-forest-400 transition-colors pb-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập địa chỉ email của bạn..."
                required
                className="bg-transparent text-xs sm:text-sm py-2 px-1 text-forest-50 focus:outline-none flex-1 placeholder:text-forest-400/60 font-sans"
              />
              <button
                type="submit"
                className="text-xs uppercase tracking-widest text-forest-300 hover:text-white pl-4 py-2 flex items-center gap-1.5 transition-colors font-semibold cursor-pointer"
              >
                <span>Đăng Ký</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
            {subscribed && (
              <p className="text-xs text-emerald-400 font-serif italic pt-1 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                Cảm ơn bạn! Thông điệp an lành đã được gửi đi.
              </p>
            )}
          </form>
        </div>

        {/* Links 1: Products */}
        <div className="md:col-span-2 space-y-3 text-xs">
          <span className="text-forest-200 tracking-widest uppercase block font-semibold mb-4 text-[11px]">
            Vật Phẩm
          </span>
          <a href="#collections" className="block text-stone-300/80 hover:text-forest-200 transition-colors">
            Gỗ Palo Santo Peru
          </a>
          <a href="#collections" className="block text-stone-300/80 hover:text-forest-200 transition-colors">
            Xô Thơm California
          </a>
          <a href="#collections" className="block text-stone-300/80 hover:text-forest-200 transition-colors">
            Nến Thơm Sáp Tự Nhiên
          </a>
          <a href="#collections" className="block text-stone-300/80 hover:text-forest-200 transition-colors">
            Vòng Tay Gỗ Tây Tạng
          </a>
          <a href="#collections" className="block text-stone-300/80 hover:text-forest-200 transition-colors">
            Nhang Trầm Không Tăm
          </a>
        </div>

        {/* Links 2: Rituals & Guide */}
        <div className="md:col-span-2 space-y-3 text-xs">
          <span className="text-forest-200 tracking-widest uppercase block font-semibold mb-4 text-[11px]">
            Trải Nghiệm
          </span>
          <a href="#about" className="block text-stone-300/80 hover:text-forest-200 transition-colors">
            Triết Lý Khói & Đất
          </a>
          <a href="#quiz" className="block text-stone-300/80 hover:text-forest-200 transition-colors">
            Trắc Nghiệm Mùi Hương
          </a>
          <a href="#ritual" className="block text-stone-300/80 hover:text-forest-200 transition-colors">
            Nghi Thức Thở 4-3-4
          </a>
          <a href="#whispers" className="block text-stone-300/80 hover:text-forest-200 transition-colors">
            Cảm Nhận Người Dùng
          </a>
        </div>

        {/* Links 3: Customer Care */}
        <div className="md:col-span-3 space-y-3 text-xs">
          <span className="text-forest-200 tracking-widest uppercase block font-semibold mb-4 text-[11px]">
            Hỗ Trợ & Liên Hệ
          </span>
          <p className="text-stone-300/80">
            Địa chỉ: 88 Phố Tĩnh Tâm, Hoàn Kiếm, Hà Nội
          </p>
          <p className="text-stone-300/80">
            Email: <span className="text-forest-300">contact@tramvakhoi.vn</span>
          </p>
          <p className="text-stone-300/80">
            Hotline: <span className="text-forest-300 font-mono font-medium">0868 238 690</span>
          </p>
          <div className="pt-3 flex items-center gap-4 text-xs text-stone-400 font-mono">
            <span className="hover:text-forest-300 cursor-pointer transition-colors">Instagram</span>
            <span className="w-1 h-1 rounded-full bg-forest-700" />
            <span className="hover:text-forest-300 cursor-pointer transition-colors">Facebook</span>
            <span className="w-1 h-1 rounded-full bg-forest-700" />
            <span className="hover:text-forest-300 cursor-pointer transition-colors">Pinterest</span>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-[1400px] mx-auto pt-12 mt-12 border-t border-forest-800/40 flex flex-col sm:flex-row justify-between items-center text-[11px] text-stone-400 gap-4">
        <span>© {new Date().getFullYear()} TRẦM & KHÓI (AURA & RITUALS). Tất cả quyền được bảo lưu.</span>
        <span className="font-serif italic text-forest-300">“Trở về với sự tĩnh tại giữa dòng đời hối hả.”</span>
      </div>
    </footer>
  );
}

