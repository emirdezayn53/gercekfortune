"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const MESSAGES = [
  "Falın inceleniyor...",
  "Biraz sabır, semboller çözülüyor...",
  "Kahve telveleri konuşuyor...",
  "Yıldızlara danışılıyor...",
  "Neredeyse bitti, meraklanma...",
  "Son dokunuşlar yapılıyor...",
];

export default function ProcessingScreen({ previewUrl }: { previewUrl: string }) {
  const [msgIdx, setMsgIdx] = useState(0);
  const [dots, setDots] = useState(".");

  useEffect(() => {
    const t = setInterval(() => setMsgIdx(i => (i + 1) % MESSAGES.length), 2800);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setDots(d => d.length >= 3 ? "" : d + "."), 500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      {/* Image with scan effect */}
      {previewUrl && (
        <div className="relative w-36 h-36 rounded-2xl overflow-hidden mb-10 gradient-border">
          <Image src={previewUrl} alt="Yüklenen fotoğraf" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-transparent to-purple-900/20" />
          <div
            className="absolute left-0 right-0 h-0.5 bg-gold/70 shadow-[0_0_12px_#c8a84b]"
            style={{ animation: "scanline 2s ease-in-out infinite" }}
          />
        </div>
      )}

      {/* Orbital spinner */}
      <div className="relative w-28 h-28 flex items-center justify-center mb-8">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-700 shadow-[0_0_30px_rgba(139,92,246,0.6)] animate-pulse-slow" />
        <div className="absolute w-full h-full rounded-full border border-purple-700/30 animate-spin-slow" />
        <div className="absolute orbit-1 w-2.5 h-2.5 rounded-full bg-gold shadow-[0_0_8px_#c8a84b]" />
        <div className="absolute orbit-2 w-2 h-2 rounded-full bg-violet-400 shadow-[0_0_6px_#a78bfa]" />
        <div className="absolute orbit-3 w-1.5 h-1.5 rounded-full bg-white/40" />
      </div>

      <h2 className="font-display text-3xl font-bold text-white mb-3">Falına Bakılıyor</h2>
      <div className="w-16 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-5" />
      <p className="text-white/50 text-lg min-h-7 transition-all duration-500">
        {MESSAGES[msgIdx]}{dots}
      </p>
      <p className="text-white/20 text-sm mt-6">Bu birkaç saniye alabilir</p>
    </div>
  );
}
