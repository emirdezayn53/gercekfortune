"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import HoroscopePopup from "@/components/HoroscopePopup";

interface Props {
  fortune: string;
  previewUrl: string;
  readingsLeft: number;
  userBurc: string;
  onReset: () => void;
}

export default function FortuneResult({ fortune, previewUrl, readingsLeft, userBurc, onReset }: Props) {
  const [displayed, setDisplayed] = useState("");
  const [typing, setTyping] = useState(true);
  const [showActions, setShowActions] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const idxRef = useRef(0);

  useEffect(() => {
    idxRef.current = 0;
    setDisplayed(""); setTyping(true); setShowActions(false); setShowPopup(false);

    timerRef.current = setInterval(() => {
      if (idxRef.current < fortune.length) {
        const end = Math.min(idxRef.current + 4, fortune.length);
        setDisplayed(fortune.slice(0, end));
        idxRef.current = end;
      } else {
        if (timerRef.current) clearInterval(timerRef.current);
        setTyping(false);
        setTimeout(() => { setShowActions(true); }, 300);
        setTimeout(() => { setShowPopup(true); }, 2500);
      }
    }, 20);

    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [fortune]);

  const skip = () => {
    if (!typing) return;
    if (timerRef.current) clearInterval(timerRef.current);
    setDisplayed(fortune); setTyping(false);
    setTimeout(() => { setShowActions(true); setShowPopup(true); }, 300);
  };

  const share = async () => {
    const text = `✨ Yapay Zeka Fal Yorumum ✨\n\n${fortune.slice(0, 250)}...\n\n🔮 Sen de bak!`;
    try {
      if (navigator.share) await navigator.share({ text, title: "Fal Yorumum" });
      else { await navigator.clipboard.writeText(text); toast.success("Fal kopyalandı! ✨"); }
    } catch { /* cancelled */ }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col items-center px-4 py-14">
        <div className="text-center mb-8 fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-gold/20 text-gold text-xs font-medium mb-5">
            ✨ Falın hazır
          </div>
          <h2 className="font-display text-4xl font-bold text-white">Fal Yorumun</h2>
        </div>

        {previewUrl && (
          <div className="relative w-20 h-20 rounded-xl overflow-hidden mb-6 gradient-border fade-up">
            <Image src={previewUrl} alt="Fotoğrafın" fill className="object-cover" />
          </div>
        )}

        <div
          className="w-full max-w-2xl glass rounded-3xl p-7 sm:p-9 mb-8 cursor-pointer fade-up gradient-border"
          onClick={skip}
          style={{ animationDelay: "0.1s" }}
        >
          <p className="text-white/85 text-lg leading-relaxed whitespace-pre-line font-light">
            {displayed}
            {typing && <span className="inline-block w-0.5 h-5 bg-gold ml-0.5 align-middle animate-pulse" />}
          </p>
          {typing && <p className="text-white/20 text-xs mt-4 text-right">Devamını görmek için dokun...</p>}
        </div>

        <div className={`flex flex-col sm:flex-row gap-3 w-full max-w-sm transition-all duration-700 ${showActions ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <button
            onClick={share}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl
              border border-white/10 text-white/70 hover:text-white hover:border-white/20
              glass transition-all duration-300 font-medium text-sm"
          >
            <span>🔗</span> Paylaş
          </button>
          <button
            onClick={onReset}
            className="btn-glow flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl
              bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition-all duration-300"
          >
            <span>🔮</span>
            {readingsLeft > 0 ? `Bir Fal Daha Bak (${readingsLeft})` : "Yeni Fal"}
          </button>
        </div>

        {showActions && readingsLeft === 0 && (
          <p className="text-white/25 text-xs mt-5 text-center fade-up">
            Ücretsiz hakkın bitti. Yeni fal bakmak için tekrar gel.
          </p>
        )}
      </div>

      {showPopup && <HoroscopePopup burc={userBurc} onClose={() => setShowPopup(false)} />}
    </>
  );
}
