"use client";

import { useState, useEffect } from "react";
import UploadZone from "@/components/UploadZone";
import ProcessingScreen from "@/components/ProcessingScreen";
import FortuneResult from "@/components/FortuneResult";
import StarsBackground from "@/components/StarsBackground";

type AppState = "home" | "processing" | "result" | "limit";

const READING_LIMIT = 3;
const STORAGE_KEY = "fal_sayisi";

export default function Home() {
  const [appState, setAppState] = useState<AppState>("home");
  const [fortune, setFortune] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [readingsLeft, setReadingsLeft] = useState(READING_LIMIT);

  useEffect(() => {
    const count = parseInt(localStorage.getItem(STORAGE_KEY) || "0");
    setReadingsLeft(Math.max(0, READING_LIMIT - count));
  }, []);

  const handleUpload = async (file: File) => {
    const count = parseInt(localStorage.getItem(STORAGE_KEY) || "0");
    if (count >= READING_LIMIT) { setAppState("limit"); return; }

    setPreviewUrl(URL.createObjectURL(file));
    setAppState("processing");

    try {
      const form = new FormData();
      form.append("image", file);
      const res = await fetch("/api/fortune", { method: "POST", body: form });
      if (!res.ok) throw new Error();
      const data = await res.json();
      const newCount = count + 1;
      localStorage.setItem(STORAGE_KEY, String(newCount));
      setReadingsLeft(Math.max(0, READING_LIMIT - newCount));
      setFortune(data.fortune);
      setAppState("result");
    } catch {
      setAppState("home");
      alert("Bir şeyler ters gitti. Tekrar dene.");
    }
  };

  const handleReset = () => {
    setFortune(""); setPreviewUrl("");
    const count = parseInt(localStorage.getItem(STORAGE_KEY) || "0");
    setAppState(count >= READING_LIMIT ? "limit" : "home");
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      <StarsBackground />
      <div className="orb w-[600px] h-[600px] bg-purple-900/20 top-[-200px] left-[-200px]" />
      <div className="orb w-[400px] h-[400px] bg-violet-800/15 bottom-[-100px] right-[-100px]" />
      <div className="orb w-[300px] h-[300px] bg-gold/5 top-[40%] left-[50%] -translate-x-1/2" />

      <div className="relative z-10">
        {appState === "home" && <HomePage onUpload={handleUpload} readingsLeft={readingsLeft} />}
        {appState === "processing" && <ProcessingScreen previewUrl={previewUrl} />}
        {appState === "result" && <FortuneResult fortune={fortune} previewUrl={previewUrl} readingsLeft={readingsLeft} onReset={handleReset} />}
        {appState === "limit" && <LimitPage onReset={() => { localStorage.removeItem(STORAGE_KEY); setReadingsLeft(READING_LIMIT); setAppState("home"); }} />}
      </div>
    </main>
  );
}

function HomePage({ onUpload, readingsLeft }: { onUpload: (f: File) => void; readingsLeft: number }) {
  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-16">
      {/* Badge */}
      <div className="fade-up mb-8">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium glass border border-purple-500/20 text-purple-300">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Yapay Zeka Destekli Fal
        </span>
      </div>

      {/* Hero */}
      <div className="fade-up text-center max-w-2xl mb-4" style={{ animationDelay: "0.1s" }}>
        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-black leading-[1.05] tracking-tight mb-6">
          <span className="text-white">Fotoğrafını Yükle,</span>
          <br />
          <span className="gold-text">Falını Öğren</span>
        </h1>
        <p className="text-lg text-white/50 font-light max-w-md mx-auto">
          Kahve falı, el falı veya tarot kartı — yapay zeka fotoğrafını analiz edip falını yorumlasın.
        </p>
      </div>

      {/* Reading counter */}
      <div className="fade-up flex items-center gap-3 mb-10" style={{ animationDelay: "0.2s" }}>
        <div className="flex gap-1.5">
          {[0,1,2].map(i => (
            <div key={i} className={`w-2 h-2 rounded-full transition-all duration-500 ${
              i < readingsLeft ? "bg-gold" : "bg-white/10"
            }`} />
          ))}
        </div>
        <span className="text-sm text-white/40">{readingsLeft} ücretsiz fal hakkı kaldı</span>
      </div>

      {/* Upload */}
      <div className="fade-up w-full max-w-md mb-14" style={{ animationDelay: "0.3s" }}>
        <UploadZone onUpload={onUpload} />
      </div>

      {/* Cards */}
      <div className="fade-up w-full max-w-2xl" style={{ animationDelay: "0.4s" }}>
        <p className="text-center text-white/25 text-sm mb-5 tracking-wide uppercase text-xs">Desteklenen fal türleri</p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: "☕", label: "Kahve Falı", desc: "Fincan dibindeki şekilleri yorumla" },
            { icon: "✋", label: "El Falı", desc: "Avuç çizgilerinden kaderini oku" },
            { icon: "🃏", label: "Tarot", desc: "Kartların gizemli mesajları" },
          ].map(c => (
            <div key={c.label} className="glass rounded-2xl p-4 text-center hover:border-purple-500/30 transition-all duration-300 hover:scale-[1.02] cursor-default">
              <div className="text-3xl mb-2">{c.icon}</div>
              <div className="text-sm font-semibold text-white/80 mb-1">{c.label}</div>
              <div className="text-xs text-white/30 leading-snug hidden sm:block">{c.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <footer className="mt-16 text-center text-white/20 text-xs">
        <p>Eğlence amaçlıdır · Yapay Zeka ile güçlendirilmiştir</p>
      </footer>
    </div>
  );
}

function LimitPage({ onReset }: { onReset: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div className="text-6xl mb-6 animate-float">🌙</div>
      <h2 className="font-display text-4xl font-bold text-white mb-3">Ücretsiz Hakkın Bitti</h2>
      <p className="text-white/40 text-lg mb-8 max-w-sm">
        3 ücretsiz fal hakkını kullandın. Yeni fal bakmak için tekrar gel.
      </p>
      <button onClick={onReset} className="text-white/30 text-sm underline underline-offset-4 hover:text-white/50 transition-colors">
        Demo sıfırla (test için)
      </button>
    </div>
  );
}
