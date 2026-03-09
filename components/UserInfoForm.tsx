"use client";

import { useState } from "react";

const BURCLAR = [
  { value: "koc", label: "♈ Koç", dates: "21 Mar – 19 Nis" },
  { value: "boga", label: "♉ Boğa", dates: "20 Nis – 20 May" },
  { value: "ikizler", label: "♊ İkizler", dates: "21 May – 20 Haz" },
  { value: "yengec", label: "♋ Yengeç", dates: "21 Haz – 22 Tem" },
  { value: "aslan", label: "♌ Aslan", dates: "23 Tem – 22 Ağu" },
  { value: "basak", label: "♍ Başak", dates: "23 Ağu – 22 Eyl" },
  { value: "terazi", label: "♎ Terazi", dates: "23 Eyl – 22 Eki" },
  { value: "akrep", label: "♏ Akrep", dates: "23 Eki – 21 Kas" },
  { value: "yay", label: "♐ Yay", dates: "22 Kas – 21 Ara" },
  { value: "oglak", label: "♑ Oğlak", dates: "22 Ara – 19 Oca" },
  { value: "kova", label: "♒ Kova", dates: "20 Oca – 18 Şub" },
  { value: "balik", label: "♓ Balık", dates: "19 Şub – 20 Mar" },
];

export interface UserInfo {
  name: string;
  age: string;
  burc: string;
}

interface Props {
  previewUrl: string;
  onSubmit: (info: UserInfo) => void;
  onBack: () => void;
}

export default function UserInfoForm({ previewUrl, onSubmit, onBack }: Props) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [burc, setBurc] = useState("");
  const [selectedBurc, setSelectedBurc] = useState<typeof BURCLAR[0] | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), age, burc: selectedBurc?.label || burc });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-14">
      <div className="w-full max-w-md fade-up">
        {/* Header */}
        <div className="text-center mb-8">
          {previewUrl && (
            <div className="w-20 h-20 rounded-2xl overflow-hidden mx-auto mb-5 gradient-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewUrl} alt="Fotoğrafın" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-purple-500/20 text-purple-300 text-xs font-medium mb-4">
            📸 Fotoğraf hazır
          </div>
          <h2 className="font-display text-3xl font-bold text-white mb-2">
            Seni Tanıyalım
          </h2>
          <p className="text-white/40 text-sm">
            Falın daha kişisel olması için birkaç bilgi lazım
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="glass rounded-3xl p-6 sm:p-8 gradient-border space-y-5">
          {/* Name */}
          <div>
            <label className="block text-white/60 text-sm mb-2 font-medium">İsmin</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Adını yaz..."
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3
                text-white placeholder-white/20 outline-none text-sm
                focus:border-violet-500/50 focus:bg-white/8 transition-all duration-200"
            />
          </div>

          {/* Age */}
          <div>
            <label className="block text-white/60 text-sm mb-2 font-medium">
              Yaşın <span className="text-white/25 font-normal">(isteğe bağlı)</span>
            </label>
            <input
              type="number"
              value={age}
              onChange={e => setAge(e.target.value)}
              placeholder="Kaç yaşındasın?"
              min="1" max="120"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3
                text-white placeholder-white/20 outline-none text-sm
                focus:border-violet-500/50 transition-all duration-200"
            />
          </div>

          {/* Zodiac */}
          <div>
            <label className="block text-white/60 text-sm mb-3 font-medium">
              Burcun <span className="text-white/25 font-normal">(isteğe bağlı)</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {BURCLAR.map(b => (
                <button
                  key={b.value}
                  type="button"
                  onClick={() => setSelectedBurc(prev => prev?.value === b.value ? null : b)}
                  className={`py-2.5 px-2 rounded-xl text-xs font-medium transition-all duration-200 text-center
                    ${selectedBurc?.value === b.value
                      ? "bg-violet-600 text-white border border-violet-400/50 scale-[1.02]"
                      : "bg-white/5 text-white/50 border border-white/8 hover:bg-white/8 hover:text-white/70"
                    }`}
                >
                  <div>{b.label}</div>
                  <div className="text-white/30 text-[9px] mt-0.5">{b.dates}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onBack}
              className="px-4 py-3 rounded-xl border border-white/10 text-white/40
                hover:text-white/60 hover:border-white/20 transition-all duration-200 text-sm"
            >
              ← Geri
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="btn-glow flex-1 py-3 rounded-xl bg-violet-600 hover:bg-violet-500
                text-white font-semibold text-sm transition-all duration-300
                disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-violet-600 disabled:hover:transform-none"
            >
              🔮 Falıma Baktır
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
