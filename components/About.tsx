"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Lock, Mail, Pause, Phone, Play, Send, Sparkles, Volume2, VolumeX } from "lucide-react";

export default function About() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  // Form State
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !email) return;

    setLoading(true);
    // Simulate async submission and save to local storage
    setTimeout(() => {
      try {
        const stored = JSON.parse(localStorage.getItem("rungu_subscribers") || "[]");
        stored.push({ phone, email, date: new Date().toISOString() });
        localStorage.setItem("rungu_subscribers", JSON.stringify(stored));
      } catch {
        // ignore storage errors
      }
      setLoading(false);
      setSubmitted(true);
      setPhone("");
      setEmail("");
    }, 600);
  };

  return (
    <section id="about" className="relative overflow-hidden bg-[#e8e4da] px-5 py-24 text-[#282723] sm:px-8 sm:py-32 lg:px-12">
      <div className="mx-auto max-w-[1500px]">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-20 xl:gap-24">
          {/* Left Column: Subscribe / Receive Messages from RUNGU */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-[#282723]/5 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#9d753d] border border-[#282723]/10 mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Bản tin & Kết nối thành viên</span>
            </div>

            <h2 className="text-4xl font-light leading-[1.08] tracking-[-0.045em] sm:text-5xl lg:text-6xl text-[#282723]">
              Nhận tin nhắn từ RUNGU
            </h2>

            <p className="mt-5 text-sm leading-relaxed text-[#5e5a52] sm:text-base max-w-xl">
              Để lại số điện thoại và email để là người đầu tiên lắng nghe những câu chuyện nốt hương mới, nhận ưu đãi riêng tư và lời mời tham gia các buổi trải nghiệm mùi hương thủ công.
            </p>

            {/* Subscription Form */}
            <div className="mt-8 max-w-xl">
              {submitted ? (
                <div className="rounded-2xl bg-emerald-900/10 border border-emerald-800/20 p-6 text-emerald-900 transition-all animate-fadeIn">
                  <div className="flex items-start gap-3.5">
                    <CheckCircle2 className="h-6 w-6 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-base font-medium text-emerald-950">Đăng ký nhận tin nhắn thành công!</h3>
                      <p className="text-xs sm:text-sm text-emerald-800/90 mt-1.5 leading-relaxed">
                        Cảm ơn bạn đã đồng hành. RUNGU sẽ sớm gửi thông điệp bình an cùng nốt hương tuyển chọn đến bạn.
                      </p>
                      <button
                        type="button"
                        onClick={() => setSubmitted(false)}
                        className="mt-4 text-xs font-medium underline text-emerald-900 hover:text-emerald-700"
                      >
                        Đăng ký thông tin khác
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Phone Input */}
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[#8c887f]">
                      <Phone className="h-4 w-4" />
                    </div>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Số điện thoại của bạn (Zalo / SMS)"
                      className="w-full rounded-xl bg-white/85 border border-[#282723]/15 pl-11 pr-4 py-3.5 text-sm text-[#282723] placeholder:text-[#8c887f] focus:bg-white focus:border-[#9d753d] focus:outline-none focus:ring-1 focus:ring-[#9d753d] transition-all shadow-sm"
                    />
                  </div>

                  {/* Email Input */}
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[#8c887f]">
                      <Mail className="h-4 w-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Địa chỉ email nhận tin"
                      className="w-full rounded-xl bg-white/85 border border-[#282723]/15 pl-11 pr-4 py-3.5 text-sm text-[#282723] placeholder:text-[#8c887f] focus:bg-white focus:border-[#9d753d] focus:outline-none focus:ring-1 focus:ring-[#9d753d] transition-all shadow-sm"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#282723] hover:bg-[#9d753d] text-white py-4 px-6 text-xs font-semibold uppercase tracking-[0.16em] transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-75"
                  >
                    {loading ? (
                      <span>Đang gửi thông tin...</span>
                    ) : (
                      <>
                        <span>Đăng ký nhận tin nhắn từ RUNGU</span>
                        <Send className="h-3.5 w-3.5" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Privacy / Trust reassurance */}
              <div className="mt-5 flex items-center gap-2 text-[11px] text-[#77736b]">
                <Lock className="h-3.5 w-3.5 text-[#9d753d] shrink-0" />
                <span>Bảo mật tuyệt đối. RUNGU cam kết không gửi thư rác hay làm phiền bạn.</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: High-Definition Ambient Ritual Video */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative aspect-[4/5] sm:aspect-[1/1] lg:aspect-[0.95/1] min-h-[460px] sm:min-h-[540px] lg:min-h-[600px] overflow-hidden rounded-3xl bg-[#201f1c] shadow-[0_30px_70px_-15px_rgba(0,0,0,0.25)] border border-[#282723]/10 group"
          >
            {/* The Video Element */}
            <video
              ref={videoRef}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              poster="/videos/palo-santo-poster.jpg"
              className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            >
              <source src="/videos/palo-santo-hero.mp4" type="video/mp4" />
            </video>

            {/* Subtle bottom gradient only for text readability - Không dùng nền bóng đen bao phủ video */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

            {/* Live Status Pill at Top-Left */}
            <div className="absolute top-5 left-5 z-10 flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-md px-3.5 py-1.5 border border-white/25 text-white text-[10px] tracking-wider uppercase">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Nghi thức khói thơm tự nhiên</span>
            </div>

            {/* Quote Caption */}
            <div className="absolute bottom-16 left-5 right-5 z-10 text-white sm:bottom-20 sm:left-6 sm:right-6">
              <p className="max-w-md text-sm sm:text-base font-light leading-relaxed text-white drop-shadow">
                &ldquo;Mỗi nốt hương gửi đi là một lời chúc an yên dành riêng cho bạn.&rdquo;
              </p>
              <span className="mt-1.5 block text-[11px] tracking-[0.16em] uppercase text-[#d5b27d] font-medium drop-shadow">
                — RUNGU Fragrance Rituals
              </span>
            </div>

            {/* Video Controls (Tạm dừng & Bật âm thanh) - Góc dưới bên trái */}
            <div className="absolute bottom-5 left-5 z-20 flex items-center gap-2">
              <button
                type="button"
                onClick={togglePlay}
                aria-label={isPlaying ? "Tạm dừng video" : "Phát video"}
                className="group flex items-center gap-1.5 rounded-full border border-white/30 bg-white/15 px-3 py-1.5 text-xs text-white backdrop-blur-md transition-all hover:bg-white hover:text-black cursor-pointer"
              >
                {isPlaying ? (
                  <>
                    <Pause className="h-3.5 w-3.5" />
                    <span className="text-[11px] font-medium">Tạm dừng</span>
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5 fill-current ml-0.5" />
                    <span className="text-[11px] font-medium">Phát video</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={toggleMute}
                aria-label={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
                className={`group flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs backdrop-blur-md transition-all cursor-pointer ${
                  !isMuted
                    ? "border-[#d5b27d] bg-[#d5b27d]/30 text-[#f7e4c6]"
                    : "border-white/30 bg-white/15 text-white hover:bg-white hover:text-black"
                }`}
              >
                {!isMuted ? (
                  <>
                    <Volume2 className="h-3.5 w-3.5 text-[#e5caa1] animate-pulse" />
                    <span className="text-[11px] font-medium">Tắt tiếng</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="h-3.5 w-3.5" />
                    <span className="text-[11px] font-medium">Bật âm thanh</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
