"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Flame, Heart, Play, Square } from "lucide-react";

export default function Ritual() {
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathText, setBreathText] = useState("SẴN SÀNG");
  const [breathSubText, setBreathSubText] = useState("Nhấn 'Bắt Đầu' để thư giãn tâm trí");
  const [circleState, setCircleState] = useState(0); // 0: normal, 1: inhale, 2: hold, 3: exhale
  const [timerCount, setTimerCount] = useState(4);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const cycle = (step: number) => {
    if (step === 0) {
      setBreathText("HÍT VÀO");
      setBreathSubText("Hít thật sâu hương gỗ thông qua cánh mũi (4s)");
      setCircleState(1);
      setTimerCount(4);
      timerRef.current = setTimeout(() => cycle(1), 4000);
    } else if (step === 1) {
      setBreathText("GIỮ HƠI THỞ");
      setBreathSubText("Cảm nhận năng lượng an tịnh lắng sâu bên trong (3s)");
      setCircleState(2);
      setTimerCount(3);
      timerRef.current = setTimeout(() => cycle(2), 3000);
    } else if (step === 2) {
      setBreathText("THỞ RA CHẬM");
      setBreathSubText("Thở nhẹ qua môi, buông bỏ toàn bộ áp lực và âu lo (4s)");
      setCircleState(3);
      setTimerCount(4);
      timerRef.current = setTimeout(() => cycle(0), 4000);
    }
  };

  const startBreath = () => {
    setIsBreathing(true);
    cycle(0);
  };

  const stopBreath = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsBreathing(false);
    setCircleState(0);
    setBreathText("SẴN SÀNG");
    setBreathSubText("Nhấn 'Bắt Đầu' để thư giãn tâm trí");
    setTimerCount(4);
  };

  useEffect(() => {
    if (!isBreathing) return;
    intervalRef.current = setInterval(() => {
      setTimerCount((prev) => (prev > 1 ? prev - 1 : 1));
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isBreathing, breathText]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <section
      id="ritual"
      className="py-28 sm:py-36 bg-linen-alt border-t border-forest-800/10 relative overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-forest-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 space-y-20">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-4 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 text-forest-700 text-xs tracking-[0.3em] uppercase font-semibold">
            <Heart className="w-3.5 h-3.5 text-forest-600" />
            <span>Nghi thức an yên</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-forest-950 font-light leading-tight descender-safe">
            Khoảnh khắc chậm lại cho tâm hồn
          </h2>
          <p className="text-forest-800/80 font-light text-sm sm:text-base leading-relaxed max-w-[65ch] mx-auto">
            Đốt một thanh gỗ không đơn thuần là thắp lửa - đó là thời khắc bạn cho phép bản thân dừng lại, hiện diện trọn vẹn và hòa mình cùng thiên nhiên.
          </p>
        </motion.div>

        {/* Asymmetrical Editorial Ritual Flow (Eliminating 3 equal cards) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Step 1: Featured Major Stage (7 Columns) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 overflow-hidden bg-white/85 border border-forest-800/15 flex flex-col justify-between group"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-forest-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=85&w=1400"
                alt="Tĩnh Tâm & Khởi Đầu"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 filter brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-950/70 via-transparent to-transparent" />
              
              <div className="absolute top-5 left-5 flex items-center gap-2">
                <span className="px-3 py-1 bg-forest-900 text-white text-[10px] font-mono tracking-widest uppercase">
                  GIAI ĐOẠN KHỞI ĐẦU
                </span>
              </div>
            </div>

            <div className="p-8 sm:p-10 space-y-4">
              <div className="flex items-center gap-3 text-forest-700 text-xs font-mono tracking-widest font-semibold">
                <Flame className="w-4 h-4 text-forest-600" />
                <span>BƯỚC ĐẦU TIÊN</span>
              </div>
              <h3 className="font-serif text-3xl sm:text-4xl text-forest-950 font-light descender-safe">
                Tạo Khoảng Trống Cho Tâm Trí
              </h3>
              <p className="text-forest-800/85 text-sm sm:text-base font-light leading-relaxed">
                Mở hé cửa sổ để làn gió đối lưu. Hãy ngồi thoải mái, đặt tay lên ngực và lắng nghe hơi thở tự nhiên của bạn trong 60 giây trước khi bắt đầu nghi thức thanh lọc không gian.
              </p>
            </div>
          </motion.div>

          {/* Steps 2 & 3: Staggered Secondary Flow (5 Columns) */}
          <div className="lg:col-span-5 flex flex-col gap-6 justify-between">
            {/* Step 2 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="p-6 sm:p-7 bg-white/75 border border-forest-800/15 hover:border-forest-700 transition-all duration-300 flex flex-col sm:flex-row gap-5 items-center group"
            >
              <div className="w-full sm:w-36 aspect-square overflow-hidden flex-shrink-0 bg-forest-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&q=85&w=800"
                  alt="Khơi Lửa & Đón Khói"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                />
              </div>
              <div className="space-y-2 text-left w-full">
                <span className="text-[10px] text-forest-700 font-mono uppercase tracking-widest block font-bold">Bước Tiếp Theo</span>
                <h4 className="font-serif text-xl text-forest-950 font-light descender-safe">Khơi Lửa Nghiêng 45°</h4>
                <p className="text-forest-800/80 text-xs font-light leading-relaxed">
                  Nghiêng thanh gỗ hoặc bó xô thơm 45 độ trên ngọn lửa trong 30 giây. Thổi nhẹ để tàn hồng lan tỏa làn khói thơm nguyên bản.
                </p>
              </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, delay: 0.25 }}
              className="p-6 sm:p-7 bg-white/75 border border-forest-800/15 hover:border-forest-700 transition-all duration-300 flex flex-col sm:flex-row gap-5 items-center group"
            >
              <div className="w-full sm:w-36 aspect-square overflow-hidden flex-shrink-0 bg-forest-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=85&w=800"
                  alt="Tận Hưởng Sự Tĩnh Lặng"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                />
              </div>
              <div className="space-y-2 text-left w-full">
                <span className="text-[10px] text-forest-700 font-mono uppercase tracking-widest block font-bold">Hoàn Thành</span>
                <h4 className="font-serif text-xl text-forest-950 font-light descender-safe">3 Nhịp Thở Sâu Tận Hưởng</h4>
                <p className="text-forest-800/80 text-xs font-light leading-relaxed">
                  Đặt thanh gỗ lên khay gốm chịu nhiệt. Nhắm mắt lại, thực hiện 3 nhịp thở sâu và cảm nhận sự xoa dịu êm ái ngập tràn khắp căn phòng.
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Interactive Mindfulness Breathing Circle Widget */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-[#d8d1c4] p-8 sm:p-14 lg:p-16 text-center max-w-4xl mx-auto space-y-8 border border-forest-800/15 relative overflow-hidden"
        >
          <div className="space-y-2">
            <span className="text-forest-700 text-xs tracking-[0.25em] uppercase font-mono font-semibold">
              Trải Nghiệm Tĩnh Tâm Ngay Tại Đây
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl text-forest-950 font-light descender-safe">
              Nghi Thức Thở 4-3-4
            </h3>
            <p className="text-forest-800/80 text-xs sm:text-sm font-light max-w-lg mx-auto leading-relaxed">
              Hòa nhịp cùng vòng tròn để kích hoạt hệ thần kinh phó giao cảm, làm dịu nhịp tim và giải phóng căng thẳng tức thì.
            </p>
          </div>

          {/* Dynamic Breathing Circle */}
          <div className="relative w-64 h-64 mx-auto flex items-center justify-center my-8">
            {/* Outer Ripple Wave */}
            {isBreathing && (
              <div
                className={`absolute inset-0 rounded-full border border-forest-600/30 transition-all duration-[4000ms] ease-in-out ${
                  circleState === 1
                    ? "scale-150 opacity-50"
                    : circleState === 3
                    ? "scale-90 opacity-15"
                    : "scale-125 opacity-25"
                }`}
              />
            )}

            {/* Inner Core Circle */}
            <div
              className={`w-40 h-40 rounded-full border flex flex-col items-center justify-center transition-all duration-[4000ms] ease-in-out shadow-xl ${
                circleState === 1
                  ? "scale-125 bg-forest-100 border-forest-700 shadow-forest-800/20"
                  : circleState === 2
                  ? "scale-125 bg-forest-200 border-forest-800 shadow-forest-800/30"
                  : circleState === 3
                  ? "scale-90 bg-forest-50 border-forest-400"
                  : "scale-100 bg-forest-50/70 border-forest-500"
              }`}
            >
              <span className="font-serif text-forest-950 text-lg tracking-widest font-normal">
                {breathText}
              </span>
              {isBreathing && (
                <span className="text-sm text-forest-700 font-mono font-bold mt-1">
                  {timerCount}s
                </span>
              )}
            </div>
          </div>

          {/* Subtext instruction */}
          <p className="text-xs sm:text-sm text-forest-700 italic font-serif h-6 font-medium">
            ✦ {breathSubText}
          </p>

          {/* Control Buttons */}
          <div className="flex justify-center gap-4 pt-2">
            {!isBreathing ? (
              <button
                onClick={startBreath}
                className="px-8 py-3.5 bg-forest-800 text-white text-xs uppercase tracking-[0.2em] font-semibold hover:bg-forest-700 transition-all flex items-center gap-2.5 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Bắt Đầu Nghi Thức Thở</span>
              </button>
            ) : (
              <button
                onClick={stopBreath}
                className="px-8 py-3.5 border border-forest-800/25 hover:border-forest-700 text-forest-800 hover:text-forest-950 text-xs uppercase tracking-[0.2em] font-medium transition-all flex items-center gap-2.5 cursor-pointer bg-[#f6f4ee]"
              >
                <Square className="w-4 h-4 fill-current" />
                <span>Dừng Lại</span>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
