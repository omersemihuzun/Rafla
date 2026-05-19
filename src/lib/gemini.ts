import {
  GoogleGenerativeAI,
  type GenerativeModel,
} from "@google/generative-ai";

const MODEL_CHAIN = [
  process.env.GEMINI_MODEL ?? "gemini-2.5-flash",
  "gemini-2.0-flash-lite",
  "gemini-1.5-flash",
].filter((m, i, arr) => arr.indexOf(m) === i);

function getClient() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY is not set");
  return new GoogleGenerativeAI(key);
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function parseJsonFromText(text: string): Record<string, unknown> {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Gemini yanıtı JSON içermiyor");
  return JSON.parse(jsonMatch[0]) as Record<string, unknown>;
}

function isRetryableError(message: string): boolean {
  return (
    message.includes("503") ||
    message.includes("429") ||
    message.includes("404") ||
    message.includes("high demand") ||
    message.includes("UNAVAILABLE")
  );
}

function toUserMessage(err: Error): string {
  const m = err.message;
  if (m.includes("503") || m.includes("high demand")) {
    return "Gemini şu an yoğun. Birkaç saniye sonra tekrar dene.";
  }
  if (m.includes("429")) {
    return "API kotası dolmuş olabilir. Kısa süre sonra tekrar dene.";
  }
  return m;
}

async function generateText(
  build: (model: GenerativeModel) => Promise<string>
): Promise<string> {
  let lastError: Error = new Error("Gemini isteği başarısız");

  for (const modelName of MODEL_CHAIN) {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const model = getClient().getGenerativeModel({ model: modelName });
        return await build(model);
      } catch (e) {
        lastError = e instanceof Error ? e : new Error(String(e));
        if (isRetryableError(lastError.message) && attempt < 2) {
          await sleep(1500 * (attempt + 1));
          continue;
        }
        if (isRetryableError(lastError.message)) break;
        throw new Error(toUserMessage(lastError));
      }
    }
  }

  throw new Error(toUserMessage(lastError));
}

export type AnalyzeHints = {
  clothingType?: string;
  extraDescription?: string;
};

export async function analyzeGarment(
  imageBase64: string,
  mimeType: string,
  hints?: AnalyzeHints
) {
  const hintBlock =
    hints?.clothingType || hints?.extraDescription
      ? `\nSatıcının notları: kıyafet tipi=${hints.clothingType ?? "belirtilmedi"}, ek açıklama=${hints.extraDescription ?? "yok"}. Bunları dikkate al.`
      : "";

  const prompt = `Sen Türkiye ikinci el kıyafet pazarı için bir ürün analiz asistanısın.
Görseli incele ve SADECE geçerli JSON döndür (markdown yok):${hintBlock}
{
  "category": "üst|alt|elbise|ayakkabı|çanta|aksesuar|diğer",
  "colors": ["..."],
  "brandGuess": "string veya null",
  "sizeGuess": "string veya null",
  "condition": "yeni_gibi|iyi|orta|belirtilmemiş",
  "visibleFlaws": ["..."],
  "suggestedTitle": "string",
  "missingForTrust": ["ölçü tablosu", "kusur fotoğrafı" gibi eksikler]
}`;

  const text = await generateText((model) =>
    model
      .generateContent([
        { text: prompt },
        { inlineData: { data: imageBase64, mimeType } },
      ])
      .then((r) => r.response.text())
  );

  return parseJsonFromText(text);
}

export async function generateListingCopy(
  analysis: Record<string, unknown>,
  platform: "dolap" | "gardrops"
) {
  const prompt = `İkinci el kıyafet ilanı yaz. Platform: ${platform}.
Analiz: ${JSON.stringify(analysis)}
SADECE JSON:
{
  "title": "max 80 karakter",
  "description": "madde madde, kusurları şeffaf yaz",
  "bullets": ["..."],
  "hashtags": ["..."],
  "qualityScore": 0-100
}`;

  const text = await generateText((model) =>
    model.generateContent(prompt).then((r) => r.response.text())
  );

  return parseJsonFromText(text);
}

export async function buyerPersonaReview(
  title: string,
  description: string
) {
  const prompt = `İkinci el kıyafet alıcı simülasyonu (Türkiye, Dolap/Gardrops).
Başlık ve açıklamayı iki farklı alıcı gözünden değerlendir.
SADECE geçerli JSON (markdown yok):
{
  "personas": [
    { "name": "Şüpheci alıcı", "comment": "2-3 cümle", "concerns": ["madde"] },
    { "name": "Hızlı karar veren", "comment": "2-3 cümle", "concerns": ["madde"] }
  ],
  "topFixes": ["en fazla 3 somut iyileştirme önerisi"]
}

Başlık: ${title}

Açıklama:
${description}`;

  const text = await generateText((model) =>
    model.generateContent(prompt).then((r) => r.response.text())
  );

  return parseJsonFromText(text);
}
