"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import StarsBackground from "@/components/StarsBackground";

const AYLAR = ["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"];

const BURCLAR = [
  { value: "Koç", emoji: "♈", element: "Ateş", color: "from-red-900/30 to-red-950/50", border: "border-red-700/30 hover:border-red-500/50" },
  { value: "Boğa", emoji: "♉", element: "Toprak", color: "from-green-900/30 to-green-950/50", border: "border-green-700/30 hover:border-green-500/50" },
  { value: "İkizler", emoji: "♊", element: "Hava", color: "from-yellow-900/30 to-yellow-950/50", border: "border-yellow-700/30 hover:border-yellow-500/50" },
  { value: "Yengeç", emoji: "♋", element: "Su", color: "from-blue-900/30 to-blue-950/50", border: "border-blue-700/30 hover:border-blue-500/50" },
  { value: "Aslan", emoji: "♌", element: "Ateş", color: "from-orange-900/30 to-orange-950/50", border: "border-orange-700/30 hover:border-orange-500/50" },
  { value: "Başak", emoji: "♍", element: "Toprak", color: "from-emerald-900/30 to-emerald-950/50", border: "border-emerald-700/30 hover:border-emerald-500/50" },
  { value: "Terazi", emoji: "♎", element: "Hava", color: "from-pink-900/30 to-pink-950/50", border: "border-pink-700/30 hover:border-pink-500/50" },
  { value: "Akrep", emoji: "♏", element: "Su", color: "from-purple-900/30 to-purple-950/50", border: "border-purple-700/30 hover:border-purple-500/50" },
  { value: "Yay", emoji: "♐", element: "Ateş", color: "from-indigo-900/30 to-indigo-950/50", border: "border-indigo-700/30 hover:border-indigo-500/50" },
  { value: "Oğlak", emoji: "♑", element: "Toprak", color: "from-slate-900/30 to-slate-950/50", border: "border-slate-700/30 hover:border-slate-500/50" },
  { value: "Kova", emoji: "♒", element: "Hava", color: "from-cyan-900/30 to-cyan-950/50", border: "border-cyan-700/30 hover:border-cyan-500/50" },
  { value: "Balık", emoji: "♓", element: "Su", color: "from-violet-900/30 to-violet-950/50", border: "border-violet-700/30 hover:border-violet-500/50" },
];

const buAy = AYLAR[new Date().getMonth()];

export default function BurcPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<typeof BURCLAR[0] | null>(null);
  const [yorum, setYorum] = useState("");
  const [loading, setLoading] = useState(false);
  const [ay] = useState(buAy);

  const handleSelect = async (burc: typeof BURCLAR[0]) => {
    if (selected?.value === burc.value && yorum) return;
    setSelected(burc);
    setYorum("");
    setLoading(true);

    try {
      const res = await fetch("/api/horoscope", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ burc: burc.value, ay }),
      });
      const data = await res.json();
      setYorum(data.yorum || "Yorum alınamadı.");
    } catch {
      setYorum("Bir hata oluştu. Tekrar dene.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      <StarsBackground />
      <div className="orb w-[500px] h-[500px] bg-purple-900/20 top-[-150px] right-[-150px]" />
      <div className="orb w-[400px] h-[400px] bg-indigo-900/15 bottom-[-100px] left-[-100px]" />

      <div className="relative z-10 px-4 py-12 max-w-4xl mx-auto">
        {/* Back */}
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-white/30 hover:text-white/60 text-sm mb-8 transition-colors"
        >
          ← Ana sayfaya dön
        </button>

        {/* Header */}
        <div className="text-center mb-10 fade-up">
          <div className="text-5xl mb-4">🌟</div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-3">
            Aylık Burç <span className="gold-text">Yorumları</span>
          </h1>
          <p className="text-white/40 text-base">
            {ay} ayında seni neler bekliyor?
          </p>
        </div>

        {/* Zodiac grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-10 fade-up" style={{ animationDelay: "0.1s" }}>
          {BURCLAR.map(b => (
            <button
              key={b.value}
              onClick={() => handleSelect(b)}
              className={`relative bg-gradient-to-b ${b.color} border ${b.border}
                rounded-2xl p-4 text-center transition-all duration-300
                hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(139,92,246,0.2)]
                ${selected?.value === b.value ? "scale-[1.03] border-violet-500/60 shadow-[0_0_20px_rgba(139,92,246,0.3)]" : ""}
              `}
            >
              {selected?.value === b.value && (
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
              )}
              <div className="text-2xl sm:text-3xl mb-1.5">{b.emoji}</div>
              <div className="text-white/80 font-semibold text-sm">{b.value}</div>
              <div className="text-white/30 text-xs mt-0.5">{b.element}</div>
            </button>
          ))}
        </div>

        {/* Result panel */}
        {selected && (
          <div className="glass gradient-border rounded-3xl p-6 sm:p-8 fade-up">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-3xl">{selected.emoji}</span>
              <div>
                <h2 className="font-display text-xl font-bold text-white">{selected.value} Burcu</h2>
                <p className="text-white/40 text-sm">{ay} Ayı Yorumu</p>
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center py-8 gap-4">
                <div className="relative w-12 h-12 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-violet-600/50 animate-pulse" />
                  <div className="absolute w-full h-full rounded-full border border-violet-700/40 animate-spin" style={{ animationDuration: "3s" }} />
                </div>
                <p className="text-white/40 text-sm">{selected.value} burcu için yorum hazırlanıyor...</p>
              </div>
            ) : (
              <p className="text-white/75 text-base leading-relaxed whitespace-pre-line font-light">
                {yorum}
              </p>
            )}
          </div>
        )}

        {!selected && (
          <div className="text-center text-white/25 text-sm py-4 fade-up" style={{ animationDelay: "0.2s" }}>
            Yorumunu görmek için burcuna tıkla ↑
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-10 fade-up" style={{ animationDelay: "0.3s" }}>
          <p className="text-white/30 text-sm mb-3">Fotoğrafınla fal baktırmak ister misin?</p>
          <button
            onClick={() => router.push("/")}
            className="btn-glow inline-flex items-center gap-2 px-6 py-3 rounded-2xl
              bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition-all duration-300"
          >
            🔮 Fal Baktır
          </button>
        </div>
      </div>
    </main>
  );
}
