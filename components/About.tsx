"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Gift,
  Lock,
  Mail,
  Pause,
  Phone,
  Play,
  Send,
  Volume2,
  VolumeX,
} from "lucide-react";

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
    setTimeout(() => {
      try {
        const stored = JSON.parse(localStorage.getItem("rungu_subscribers") || "[]");
        stored.push({ phone, email, date: new Date().toISOString() });
        localStorage.setItem("rungu_subscribers", JSON.stringify(stored));
      } catch {
        // ignore
      }
      setLoading(false);
      setSubmitted(true);
      setPhone("");
      setEmail("");
    }, 600);
  };

  return (
    <section
      id="about"
      aria-label="Nhận ưu đãi riêng từ RUNGU"
      className="border-b border-[#282723]/15 bg-[#e8e4da] text-[#282723] overflow-hidden"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[640px] lg:min-h-[740px]">
        {/* ============================================================ */}
        {/* LEFT COLUMN: Full-screen Ambient Video (video thường ngày)    */}
        {/* ============================================================ */}
        <div className="relative min-h-[520px] sm:min-h-[580px] lg:min-h-full bg-[#181715] flex flex-col justify-between p-6 sm:p-10 lg:p-12 overflow-hidden group/video order-1 lg:order-1">
          {/* Background Video - Edge to edge */}
          <video
            ref={videoRef}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            key="/videos/thuong-ngay.mp4"
            className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
          >
            <source src="/videos/thuong-ngay.mp4" type="video/mp4" />
          </video>

          {/* Cinematic Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/30 pointer-events-none" />

          {/* Top Live Status Pill */}
          <div className="relative z-10 flex items-center justify-center lg:justify-start">
            <div className="flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-md px-4 py-2 border border-white/25 text-white text-xs sm:text-sm font-medium tracking-wider uppercase">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Khoảnh khắc thường ngày & hương thơm</span>
            </div>
          </div>

          {/* Bottom Overlay: Quote Caption & Video Controls */}
          <div className="relative z-10 mt-auto pt-24 text-white text-center lg:text-left flex flex-col items-center lg:items-start">
            <p className="max-w-lg text-base sm:text-lg lg:text-xl font-normal leading-relaxed text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)] mx-auto lg:mx-0">
              &ldquo;Mỗi nốt hương gửi đi là một lời chúc an yên dành riêng cho bạn.&rdquo;
            </p>
            <span className="mt-3 block text-xs sm:text-sm tracking-[0.18em] uppercase text-[#e5caa1] font-semibold drop-shadow-sm mx-auto lg:mx-0">
              — RUNGU Fragrance Rituals
            </span>

            {/* Video Controls (Tạm dừng & Âm thanh) */}
            <div className="mt-8 flex items-center justify-center lg:justify-start gap-3">
              <button
                type="button"
                onClick={togglePlay}
                aria-label={isPlaying ? "Tạm dừng video" : "Phát video"}
                className="group flex items-center gap-2 rounded-full border border-white/30 bg-black/40 px-4 py-2 text-xs sm:text-sm text-white backdrop-blur-md transition-all hover:bg-white hover:text-black cursor-pointer"
              >
                {isPlaying ? (
                  <>
                    <Pause className="h-4 w-4" />
                    <span className="font-medium">Tạm dừng</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 fill-current ml-0.5" />
                    <span className="font-medium">Phát video</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={toggleMute}
                aria-label={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
                className={`group flex items-center gap-2 rounded-full border px-4 py-2 text-xs sm:text-sm backdrop-blur-md transition-all cursor-pointer ${
                  !isMuted
                    ? "border-[#d5b27d] bg-[#d5b27d]/30 text-[#f7e4c6]"
                    : "border-white/30 bg-black/40 text-white hover:bg-white hover:text-black"
                }`}
              >
                {!isMuted ? (
                  <>
                    <Volume2 className="h-4 w-4 text-[#e5caa1] animate-pulse" />
                    <span className="font-medium">Tắt tiếng</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="h-4 w-4" />
                    <span className="font-medium">Bật âm thanh</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* RIGHT COLUMN: Spacious Exclusive Perks Form & Brand Story    */}
        {/* ============================================================ */}
        <div className="flex flex-col justify-center px-6 py-14 sm:px-12 sm:py-20 lg:px-16 xl:px-24 order-2 lg:order-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-2xl w-full mx-auto lg:mx-0 text-center lg:text-left flex flex-col items-center lg:items-start"
          >
            <h2 className="text-2xl sm:text-4xl lg:text-5xl xl:text-[3.25rem] font-normal leading-[1.15] tracking-[-0.035em] text-[#282723] mx-auto lg:mx-0">
              Nhận ưu đãi riêng từ RUNGU
            </h2>

            <p className="mt-5 text-base sm:text-lg lg:text-xl leading-relaxed text-[#4e4a42] mx-auto lg:mx-0">
              Để lại số điện thoại và email để nhận những ưu đãi đặc quyền dành riêng từ RUNGU, quà tặng trải nghiệm và là người đầu tiên lắng nghe những câu chuyện hương thơm mới.
            </p>

            {/* Form Section */}
            <div className="mt-8 sm:mt-10 w-full">
              {submitted ? (
                <div className="rounded-2xl bg-emerald-900/10 border border-emerald-800/20 p-8 text-emerald-900 transition-all animate-fadeIn text-left">
                  <div className="flex items-start gap-4">
                    <CheckCircle2 className="h-7 w-7 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-xl font-semibold text-emerald-950">
                        Đăng ký nhận ưu đãi thành công!
                      </h3>
                      <p className="text-base text-emerald-800/90 mt-2 leading-relaxed">
                        Cảm ơn bạn đã đồng hành. RUNGU sẽ sớm gửi thông tin ưu đãi đặc quyền dành riêng cho bạn.
                      </p>
                      <button
                        type="button"
                        onClick={() => setSubmitted(false)}
                        className="mt-5 text-sm font-semibold underline text-emerald-900 hover:text-emerald-700 cursor-pointer"
                      >
                        Đăng ký thông tin khác
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 text-left">
                  {/* Phone Input */}
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5 text-[#8c887f]">
                      <Phone className="h-5 w-5" />
                    </div>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Số điện thoại của bạn (Zalo / SMS)"
                      className="w-full rounded-xl bg-white border border-[#282723]/15 pl-13 pr-5 py-4 sm:py-4.5 text-base sm:text-lg text-[#282723] placeholder:text-[#8c887f] focus:border-[#9d753d] focus:outline-none focus:ring-2 focus:ring-[#9d753d]/20 transition-all shadow-sm"
                    />
                  </div>

                  {/* Email Input */}
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5 text-[#8c887f]">
                      <Mail className="h-5 w-5" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Địa chỉ email nhận ưu đãi"
                      className="w-full rounded-xl bg-white border border-[#282723]/15 pl-13 pr-5 py-4 sm:py-4.5 text-base sm:text-lg text-[#282723] placeholder:text-[#8c887f] focus:border-[#9d753d] focus:outline-none focus:ring-2 focus:ring-[#9d753d]/20 transition-all shadow-sm"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center gap-3 rounded-xl bg-[#282723] hover:bg-[#9d753d] text-white py-4.5 sm:py-5 px-8 text-sm sm:text-base font-semibold uppercase tracking-[0.16em] transition-all duration-300 shadow-md hover:shadow-xl disabled:opacity-75 cursor-pointer"
                  >
                    {loading ? (
                      <span>Đang gửi thông tin...</span>
                    ) : (
                      <>
                        <span>Nhận ưu đãi riêng từ RUNGU</span>
                        <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Exclusive Perks Bar */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[#282723]/15 pt-6 text-xs sm:text-sm text-[#504c44]">
                <div className="flex items-center justify-center lg:justify-start gap-2.5">
                  <Gift className="h-4 w-4 text-[#9d753d] shrink-0" />
                  <span>Ưu đãi đặc quyền cho thành viên mới</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-2.5">
                  <Lock className="h-4 w-4 text-[#9d753d] shrink-0" />
                  <span>Bảo mật tuyệt đối, không gửi thư rác</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
