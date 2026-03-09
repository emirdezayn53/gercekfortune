import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fal Bak — Yapay Zeka ile Falını Öğren",
  description: "Kahve fincanı, el falı veya tarot kartı fotoğrafını yükle, yapay zeka falını yorumlasın.",
  openGraph: {
    title: "Fal Bak — Yapay Zeka Fal Yorumu",
    description: "Fotoğrafını yükle, falın ortaya çıksın.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#12101f",
              color: "#f0eeff",
              border: "1px solid rgba(139,92,246,0.3)",
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              borderRadius: "12px",
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
