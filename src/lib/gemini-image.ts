/**
 * Gemini görsel üretim — manken / vitrin sahnesi.
 */

const IMAGE_MODELS = [
  process.env.GEMINI_IMAGE_MODEL,
  "gemini-2.0-flash-preview-image-generation",
  "gemini-2.5-flash-image-preview",
  "gemini-2.0-flash-exp-image-generation",
].filter((m): m is string => Boolean(m))
  .filter((m, i, a) => a.indexOf(m) === i);

export type ModelSceneHints = {
  clothingType?: string;
  extraDescription?: string;
  style?: "white" | "flat" | "mirror" | "model";
};

function extractImageBuffer(data: unknown): Buffer | null {
  const root = data as {
    candidates?: Array<{
      content?: {
        parts?: Array<{
          inlineData?: { data?: string; mimeType?: string };
          inline_data?: { data?: string; mime_type?: string };
        }>;
      };
    }>;
  };

  for (const part of root.candidates?.[0]?.content?.parts ?? []) {
    const raw = part.inlineData?.data ?? part.inline_data?.data;
    if (raw) {
      const buf = Buffer.from(raw, "base64");
      if (buf.length > 4096) return buf;
    }
  }
  return null;
}

export async function generateOnModelImage(
  imageBase64: string,
  mimeType: string,
  hints?: ModelSceneHints
): Promise<Buffer> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY tanımlı değil");

  const garment = hints?.clothingType?.trim() || "giysi";
  const extra = hints?.extraDescription?.trim() ?? "";

  const prompt = `Professional e-commerce fashion photo for Turkish marketplace (Dolap/Gardrops).

Task: Create ONE photorealistic listing image showing the ${garment} from the reference photo worn on a slim female fashion model (torso and waist, face cropped or soft focus).

Rules:
- Match exact colors, pattern, fabric texture and garment shape from the reference.
- Clean light grey studio background, soft professional lighting.
- No text, watermark, logo or extra props.
${extra ? `Notes: ${extra}` : ""}`.trim();

  let lastError = "Görsel modeli yanıt vermedi";

  for (const model of IMAGE_MODELS) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: prompt },
                  {
                    inline_data: {
                      mime_type: mimeType,
                      data: imageBase64,
                    },
                  },
                ],
              },
            ],
            generationConfig: {
              responseModalities: ["IMAGE"],
            },
          }),
          signal: AbortSignal.timeout(120_000),
        }
      );

      const json = (await res.json()) as Record<string, unknown>;
      if (!res.ok) {
        lastError =
          (json.error as { message?: string })?.message ??
          `Gemini image API ${res.status}`;
        continue;
      }

      const buf = extractImageBuffer(json);
      if (buf) return buf;
      lastError = "Yanıtta geçerli görsel yok";
    } catch (e) {
      lastError = e instanceof Error ? e.message : String(e);
    }
  }

  throw new Error(lastError);
}
