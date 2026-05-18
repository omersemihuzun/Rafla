/**
 * Arka plan kaldırma: önce Python rembg servisi, yoksa sharp ile basit beyaz fon.
 */

const REMBG_URL = process.env.REMBG_SERVICE_URL ?? "http://localhost:8000";

export type BgRemoveResult = {
  buffer: Buffer;
  mode: "rembg" | "fallback";
};

export async function removeBackground(
  imageBuffer: Buffer
): Promise<BgRemoveResult> {
  try {
    const form = new FormData();
    form.append(
      "file",
      new Blob([new Uint8Array(imageBuffer)], { type: "image/png" }),
      "upload.png"
    );

    const res = await fetch(`${REMBG_URL}/remove-bg`, {
      method: "POST",
      body: form,
      signal: AbortSignal.timeout(120_000),
    });

    if (!res.ok) throw new Error(`rembg service ${res.status}`);
    return {
      buffer: Buffer.from(await res.arrayBuffer()),
      mode: "rembg",
    };
  } catch {
    return {
      buffer: await fallbackWhiteBackground(imageBuffer),
      mode: "fallback",
    };
  }
}

async function fallbackWhiteBackground(input: Buffer): Promise<Buffer> {
  const sharp = (await import("sharp")).default;
  return sharp(input)
    .resize(1200, 1200, { fit: "inside", withoutEnlargement: true })
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    .png()
    .toBuffer();
}
