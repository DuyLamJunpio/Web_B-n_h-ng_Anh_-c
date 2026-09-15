"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

/**
 * Chuông xoay Tây Tạng (Tibetan Singing Bowl 432Hz)
 * Tổng hợp âm thanh bằng Web Audio API thuần, siêu nhẹ và êm ái.
 */
export default function SoundAmbience({ placement = "floating" }: { placement?: "floating" | "nav" }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const getAudioContext = () => {
    if (!audioCtxRef.current && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const playSingingBowl = () => {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const baseFreq = 216; // Tần số A3 chuẩn 432Hz
    const harmonics = [1, 2.76, 5.4, 8.93];
    const gains = [0.25, 0.12, 0.05, 0.02];

    harmonics.forEach((harmonic, index) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(baseFreq * harmonic, now);
      osc.frequency.linearRampToValueAtTime(baseFreq * harmonic * 0.998, now + 5.0);

      gainNode.gain.setValueAtTime(0.001, now);
      gainNode.gain.linearRampToValueAtTime(gains[index], now + 0.08);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 6.5);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 6.8);
    });
  };

  const toggleSound = () => {
    if (isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      playSingingBowl();
      timerRef.current = setInterval(() => {
        playSingingBowl();
      }, 8500);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <button
      type="button"
      onClick={toggleSound}
      title={isPlaying ? "Tắt âm thanh chuông thiền" : "Bật chuông xoay Tây Tạng chữa lành"}
      aria-pressed={isPlaying}
      aria-label={isPlaying ? "Tắt chuông thiền 432Hz" : "Bật chuông xoay Tây Tạng"}
      className={`${
        placement === "nav"
          ? "flex h-9 w-9 items-center justify-center transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[#d8b879] sm:w-10"
          : "fixed bottom-6 right-6 z-40 flex items-center gap-2.5 rounded-full px-4 py-2.5 shadow-xl"
      } text-xs font-medium backdrop-blur-md transition-all duration-300 cursor-pointer ${
        isPlaying
          ? placement === "nav"
            ? "bg-[#d8b879] text-[#252520]"
            : "bg-forest-800 text-white ring-2 ring-forest-700/60 shadow-forest-900/20 scale-105 font-semibold"
          : placement === "nav"
            ? "text-[#e2ddd3] hover:text-[#d8b879]"
            : "bg-white/95 text-forest-800 border border-forest-800/20 hover:bg-forest-50 hover:text-forest-950 shadow-md"
      }`}
    >
      <span className="relative flex h-2.5 w-2.5">
        {isPlaying ? (
          <>
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-forest-200 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#d8b879]"></span>
          </>
        ) : (
          <span className="inline-flex rounded-full h-2.5 w-2.5 bg-[#b88d4a]"></span>
        )}
      </span>
      <span className={`${placement === "nav" ? "hidden" : "hidden sm:inline"} font-serif italic text-xs tracking-wider`}>
        {isPlaying ? "Chuông Thiền 432Hz" : "Chuông Xoay Tây Tạng"}
      </span>
      {isPlaying ? (
      <Volume2 className="w-4 h-4 text-[#252520] animate-pulse" />
      ) : (
        <VolumeX className="w-4 h-4 text-[#c7c0b4]" />
      )}
    </button>
  );
}
