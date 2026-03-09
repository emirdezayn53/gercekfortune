"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";

export default function UploadZone({ onUpload }: { onUpload: (file: File) => void }) {
  const [dragging, setDragging] = useState(false);

  const onDrop = useCallback((accepted: File[], rejected: unknown[]) => {
    setDragging(false);
    if ((rejected as File[]).length > 0) { toast.error("Geçersiz dosya. JPG veya PNG yükle."); return; }
    if (accepted[0]?.size > 10 * 1024 * 1024) { toast.error("Dosya çok büyük. Maks 10MB."); return; }
    if (accepted[0]) onUpload(accepted[0]);
  }, [onUpload]);

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    accept: { "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"], "image/webp": [".webp"] },
    maxFiles: 1,
    onDragEnter: () => setDragging(true),
    onDragLeave: () => setDragging(false),
  });

  return (
    <div
      {...getRootProps()}
      className={`upload-zone rounded-3xl p-10 text-center cursor-pointer glass ${dragging ? "upload-zone-active" : ""}`}
    >
      <input {...getInputProps()} />
      <div className={`text-5xl mb-4 transition-transform duration-300 ${dragging ? "scale-125" : "animate-float"}`}>
        {dragging ? "✨" : "📸"}
      </div>
      <p className="text-white/70 font-medium mb-1 text-lg">
        {dragging ? "Bırak, fala başlayalım!" : "Fotoğrafını buraya sürükle"}
      </p>
      <p className="text-white/30 text-sm mb-6">veya tıkla ve seç</p>
      <button
        type="button"
        onClick={e => { e.stopPropagation(); open(); }}
        className="btn-glow inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl
          bg-violet-600 hover:bg-violet-500 text-white font-semibold text-base
          transition-all duration-300"
      >
        Fotoğraf Yükle
      </button>
      <p className="text-white/20 text-xs mt-5">JPG, PNG, WebP · Maks 10MB · 📱 Mobilde kamera ile çekebilirsin</p>
    </div>
  );
}
