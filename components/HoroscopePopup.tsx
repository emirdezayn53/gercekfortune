"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface Props {
  burc: string;
  onClose: () => void;
}

export default function HoroscopePopup({ burc, onClose }: Props) {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(onClose, 12000);
    return () => clearTimeout(t);
  }, [onClose]);

  const handleYes = () => {
    router.push("/burc");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Card */}
      <div className="relative w-full max-w-sm glass gradient-border rounded-3xl p-6 fade-up">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/30 hover:text-white/60 transition-colors text-lg"
        >
          ✕
        </button>

        {/* Icon */}
        <div className="text-4xl mb-3 text-center animate-float">🌟</div>

        <h3 className="font-display text-xl font-bold text-white text-center mb-2">
          Aylık Burç Yorumun
        </h3>
        <p className="text-white/50 text-sm text-center mb-5 leading-relaxed">
          {burc ? (
            <>
              <span className="text-gold font-medium">{burc}</span> burcunun bu aylık
              yorumuna bakmak ister misin?
            </>
          ) : (
            "Bu ay seni neler bekliyor? Tüm burç yorumlarına göz at!"
          )}
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-white/10 text-white/40
              hover:text-white/60 text-sm transition-all duration-200"
          >
            Hayır, kalsın
          </button>
          <button
            onClick={handleYes}
            className="btn-glow flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600
              text-white font-semibold text-sm transition-all duration-300"
          >
            ✨ Evet, göster!
          </button>
        </div>

        {/* Progress bar */}
        <div className="mt-4 h-0.5 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-violet-500/40 rounded-full"
            style={{ animation: "shrink 12s linear forwards" }}
          />
        </div>
        <style jsx>{`
          @keyframes shrink {
            from { width: 100%; }
            to { width: 0%; }
          }
        `}</style>
      </div>
    </div>
  );
}
