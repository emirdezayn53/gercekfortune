import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

function getOpenAI() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

export async function POST(request: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "API anahtarı tanımlı değil" }, { status: 500 });
  }

  try {
    const formData = await request.formData();
    const imageFile = formData.get("image") as File;
    const name = formData.get("name") as string || "";
    const age = formData.get("age") as string || "";
    const burc = formData.get("burc") as string || "";

    if (!imageFile) {
      return NextResponse.json({ error: "Fotoğraf bulunamadı" }, { status: 400 });
    }

    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(imageFile.type)) {
      return NextResponse.json({ error: "Geçersiz dosya türü. JPEG, PNG veya WebP yükleyin." }, { status: 400 });
    }

    if (imageFile.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "Dosya çok büyük. Maksimum 10MB." }, { status: 400 });
    }

    const kisisel = [
      name && `İsim: ${name}`,
      age && `Yaş: ${age}`,
      burc && `Burç: ${burc}`,
    ].filter(Boolean).join(", ");

    const prompt = `Sen deneyimli bir Türk falcısısın. Sana yüklenen fotoğrafı dikkatlice incele.

${kisisel ? `Kişi hakkında bilgi: ${kisisel}` : ""}

Eğer fotoğraf bir kahve fincanıysa:
- Fincan dibindeki ve kenarlarındaki şekilleri, sembolleri ve figürleri yorumla.
- Her sembolün o kişinin hayatındaki karşılığını anlat.
- Aşk, iş, seyahat ve sağlık konularına değin.

Eğer el falıysa:
- Kader çizgisi, kalp çizgisi, akıl çizgisi ve yaşam çizgisini yorumla.
- Kişinin karakteri ve geleceği hakkında özgün şeyler söyle.

Eğer tarot kartıysa:
- Kartı tanımla ve sembolizmini yorumla.
- Kişinin şu anki durumuna ve yakın geleceğine bağla.

Türkçe yaz. Samimi, günlük konuşma diliyle yaz.

Kurallar:
- ${name ? `"${name}" diye hitap et` : 'Kişiyi "sen" diye hitap et'}
- ${burc ? `${burc} burcunun özelliklerini de hesaba kat` : ""}
- Doğal Türkçe kullan
- Hafif nükteli ol ama abarma
- Özgün ve kişisel hissettir, genel klişelerden kaçın
- Somut olaylar ve olasılıklardan bahset

Uzunluk: 150-250 kelime.
Sonu merak uyandıran, kısa ve çarpıcı bir cümleyle bitir.`;

    const bytes = await imageFile.arrayBuffer();
    const base64Image = Buffer.from(bytes).toString("base64");
    const mimeType = imageFile.type as "image/jpeg" | "image/png" | "image/gif" | "image/webp";

    const openai = getOpenAI();
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      max_tokens: 700,
      messages: [{
        role: "user",
        content: [
          { type: "text", text: prompt },
          { type: "image_url", image_url: { url: `data:${mimeType};base64,${base64Image}`, detail: "high" } },
        ],
      }],
    });

    const fortune = response.choices[0]?.message?.content;
    if (!fortune) throw new Error("Fal üretilemedi");

    return NextResponse.json({ fortune });
  } catch (error) {
    console.error("Fal API hatası:", error);
    if (error instanceof OpenAI.APIError) {
      if (error.status === 401) return NextResponse.json({ error: "Geçersiz API anahtarı" }, { status: 401 });
      if (error.status === 429) return NextResponse.json({ error: "Kota aşıldı. Lütfen biraz bekle." }, { status: 429 });
    }
    return NextResponse.json({ error: "Fal yorumu alınamadı" }, { status: 500 });
  }
}
