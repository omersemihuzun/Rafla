/**
 * Gemini görsel üretim — manken / ayna selfie
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import type { GarmentAgeGroup } from "./garment-context";

const IMAGE_MODELS = [
  process.env.GEMINI_IMAGE_MODEL,
  "gemini-2.5-flash-image",
  "gemini-3.1-flash-image-preview",
  "gemini-2.5-flash-image-preview",
  "gemini-3-pro-image-preview",
]
  .filter((m): m is string => Boolean(m))
  .filter((m, i, a) => a.indexOf(m) === i);

export type AiSceneStyle = "model" | "mirror";

export type AiSceneHints = {
  promptGarment: string;
  ageGroup: GarmentAgeGroup;
  extraDescription?: string;
  style: AiSceneStyle;
};

function getClient() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY tanımlı değil");
  return new GoogleGenerativeAI(key);
}

function extractImageBuffer(response: {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        inlineData?: { data?: string; mimeType?: string };
        text?: string;
      }>;
    };
  }>;
}): Buffer | null {
  for (const part of response.candidates?.[0]?.content?.parts ?? []) {
    const raw = part.inlineData?.data;
    if (raw) {
      const buf = Buffer.from(raw, "base64");
      if (buf.length > 4096) return buf;
    }
  }
  return null;
}

function imageTruthBlock(hints: AiSceneHints): string {
  return `CRITICAL — reference IMAGE is the source of truth for garment type, size, colors, print and proportions.
Category hint (${hints.promptGarment}) is secondary: if the photo shows infant/baby clothing, keep INFANT scale; never upscale to adult loungewear or wrong garment type.`;
}

function subjectBlock(hints: AiSceneHints): string {
  if (hints.ageGroup === "child") {
    return `Subject: child model 6–10 years old, natural pose, family-safe.`;
  }
  return `Subject: young adult woman 22–28, everyday Turkish second-hand seller aesthetic, natural proportions.`;
}

function buildModelPrompt(hints: AiSceneHints): string {
  const extra = hints.extraDescription?.trim();

  return `${imageTruthBlock(hints)}

TASK: ONE photorealistic photo — ${hints.promptGarment} worn on a person.

${subjectBlock(hints)}
Garment: match reference exactly (colors, print, neckline, sleeves, hem). Worn naturally, not pasted.
Framing: medium-full shot, head to knees or full body; ~60% frame height; soft grey studio (#f0f0f2).
Modest, family-safe resale listing. No watermark or text.
${extra ? `Seller notes: ${extra}` : ""}`.trim();
}

function buildMirrorPrompt(hints: AiSceneHints): string {
  const extra = hints.extraDescription?.trim();

  return `${imageTruthBlock(hints)}

TASK: ONE photorealistic MIRROR SELFIE for a second-hand listing — everyday life, NOT studio catalog.

${subjectBlock(hints)}
Garment: exact ${hints.promptGarment} from reference — same pattern, colors and fit, worn naturally.
Setting: real home (bedroom or hallway), full-length wardrobe mirror, soft window daylight, lived-in but tidy room.
Vibe: casual seller photo before uploading — slight imperfections OK, phone in hand optional, natural stance.
Composition: vertical 3:4, mirror edges slightly visible, authentic social/marketplace photo.
Do NOT change infant clothing into adult pajamas or wrong garment category.
${extra ? `Seller notes: ${extra}` : ""}`.trim();
}

function buildPrompt(hints: AiSceneHints): string {
  return hints.style === "mirror"
    ? buildMirrorPrompt(hints)
    : buildModelPrompt(hints);
}

export async function generateAiSceneImage(
  imageBase64: string,
  mimeType: string,
  hints: AiSceneHints
): Promise<Buffer> {
  const prompt = buildPrompt(hints);
  let lastError = "Görsel modeli yanıt vermedi";

  const modalitySets: Array<["IMAGE"] | ["TEXT", "IMAGE"]> = [
    ["IMAGE"],
    ["TEXT", "IMAGE"],
  ];

  for (const modelName of IMAGE_MODELS) {
    for (const modalities of modalitySets) {
      try {
        const model = getClient().getGenerativeModel({
          model: modelName,
          generationConfig: {
            // @ts-expect-error — image modality
            responseModalities: modalities,
          },
        });

        const result = await model.generateContent([
          {
            inlineData: {
              mimeType: mimeType || "image/png",
              data: imageBase64,
            },
          },
          { text: prompt },
        ]);

        const buf = extractImageBuffer(result.response);
        if (buf) return buf;
        lastError = `${modelName}: yanıtta görsel yok`;
      } catch (e) {
        lastError =
          e instanceof Error
            ? `${modelName}: ${e.message}`
            : `${modelName}: bilinmeyen hata`;
      }
    }
  }

  const label = hints.style === "mirror" ? "Ayna selfie" : "Manken";
  const short =
    lastError.length > 200 ? `${lastError.slice(0, 200)}…` : lastError;
  throw new Error(
    `${label} görseli üretilemedi (${short}). GEMINI_IMAGE_MODEL ve API anahtarını kontrol edin.`
  );
}

export async function generateOnModelImage(
  imageBase64: string,
  mimeType: string,
  hints?: {
    promptGarment: string;
    ageGroup: GarmentAgeGroup;
    extraDescription?: string;
  }
): Promise<Buffer> {
  return generateAiSceneImage(imageBase64, mimeType, {
    promptGarment: hints?.promptGarment ?? "clothing item",
    ageGroup: hints?.ageGroup ?? "adult",
    extraDescription: hints?.extraDescription,
    style: "model",
  });
}
