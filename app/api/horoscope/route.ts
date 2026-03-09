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
    const { burc, ay } = await request.json();

    const prompt = `Sen deneyimli bir Türk astrologsun.

${burc} burcu için ${ay} ayının yorumunu yaz.

Şu konuları kapsa:
- Aşk ve ilişkiler
- İş ve kariyer
- Para ve maddi durum
- Sağlık ve enerji
- Genel tavsiye

Kurallar:
- Türkçe yaz, samimi ve akıcı ol
- Kişiye özel ve somut hissettir
- Hafif nükteli ama abartısız ol
- Klişe cümlelerden kaçın
- "Bu ay seni şunlar bekliyor..." gibi bir girişle başla
- Her konuya 1-2 cümle, toplamda 200-250 kelime

Sonu motivasyonel ve merak uyandıran bir cümleyle bitir.`;

    const openai = getOpenAI();
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      max_tokens: 600,
      messages: [{ role: "user", content: prompt }],
    });

    const yorum = response.choices[0]?.message?.content;
    if (!yorum) throw new Error("Yorum üretilemedi");

    return NextResponse.json({ yorum });
  } catch (error) {
    console.error("Burç API hatası:", error);
    return NextResponse.json({ error: "Burç yorumu alınamadı" }, { status: 500 });
  }
}
