import sharp from "sharp";
import { generateOnModelImage } from "./gemini-image";
import { removeBackground } from "./rembg";

export type SceneStyle = "white" | "flat" | "mirror" | "model";

const CANVAS_W = 1200;
const CANVAS_H = 1600;

export function sceneCreditCost(style: SceneStyle): number {
  if (style === "mirror") return 2;
  if (style === "model") return 1;
  return 1;
}

export async function renderModelScene(
  imageBuffer: Buffer,
  mimeType: string,
  hints?: { clothingType?: string; extraDescription?: string }
): Promise<{ buffer: Buffer; mode: "gemini" | "fallback" }> {
  let product = imageBuffer;
  try {
    const bg = await removeBackground(imageBuffer);
    product = bg.buffer;
  } catch {
    /* orijinal ile dene */
  }

  const base64 = product.toString("base64");
  try {
    const buffer = await generateOnModelImage(base64, "image/png", {
      ...hints,
      style: "model",
    });
    return { buffer, mode: "gemini" };
  } catch {
    const cutout = await sharp(product)
      .resize(700, 900, { fit: "inside", withoutEnlargement: true })
      .png()
      .toBuffer();
    const { width: pw = 500, height: ph = 700 } = await sharp(cutout).metadata();
    const buffer = await sharp({
      create: {
        width: CANVAS_W,
        height: CANVAS_H,
        channels: 3,
        background: { r: 248, g: 248, b: 250 },
      },
    })
      .composite([{ input: cutout, left: Math.round((CANVAS_W - pw) / 2), top: 280 }])
      .jpeg({ quality: 90 })
      .toBuffer();
    return { buffer, mode: "fallback" };
  }
}

export async function renderProductScene(
  imageBuffer: Buffer,
  style: SceneStyle,
  hasAlpha: boolean,
  hints?: { clothingType?: string; extraDescription?: string },
  mimeType = "image/jpeg"
): Promise<{ buffer: Buffer; mode: string }> {
  if (style === "model") {
    return renderModelScene(imageBuffer, mimeType, hints);
  }

  let product = imageBuffer;
  let mode: "rembg" | "existing" | "fallback" = hasAlpha ? "existing" : "fallback";

  if (!hasAlpha) {
    const bg = await removeBackground(imageBuffer);
    product = bg.buffer;
    mode = bg.mode;
  }

  const cutout = await sharp(product)
    .resize(1000, 1200, { fit: "inside", withoutEnlargement: true })
    .png()
    .toBuffer();

  const { width: pw = 800, height: ph = 900 } = await sharp(cutout).metadata();
  const left = Math.round((CANVAS_W - pw) / 2);
  const top = Math.round((CANVAS_H - ph) / 2);

  if (style === "white") {
    const buffer = await sharp({
      create: {
        width: CANVAS_W,
        height: CANVAS_H,
        channels: 3,
        background: { r: 255, g: 255, b: 255 },
      },
    })
      .composite([{ input: cutout, left, top }])
      .png()
      .toBuffer();
    return { buffer, mode };
  }

  if (style === "flat") {
    const buffer = await sharp({
      create: {
        width: CANVAS_W,
        height: CANVAS_H,
        channels: 3,
        background: { r: 238, g: 238, b: 240 },
      },
    })
      .composite([
        {
          input: await sharp({
            create: {
              width: Math.min(pw + 80, CANVAS_W),
              height: 24,
              channels: 4,
              background: { r: 0, g: 0, b: 0, alpha: 0.12 },
            },
          })
            .blur(8)
            .png()
            .toBuffer(),
          left: Math.max(0, left + Math.round(pw / 2) - 40),
          top: top + ph - 12,
        },
        { input: cutout, left, top: top - 20 },
      ])
      .jpeg({ quality: 92 })
      .toBuffer();
    return { buffer, mode };
  }

  // mirror — sıcak oda tonu + hafif yansıma hissi
  const room = await sharp({
    create: {
      width: CANVAS_W,
      height: CANVAS_H,
      channels: 3,
      background: { r: 232, g: 224, b: 214 },
    },
  })
    .linear(1.05, -8)
    .jpeg()
    .toBuffer();

  const reflection = await sharp(cutout)
    .flip()
    .resize(pw, Math.round(ph * 0.35), { fit: "inside" })
    .linear(1, 0)
    .png()
    .toBuffer();

  const { width: rw = pw, height: rh = 120 } = await sharp(reflection).metadata();

  const buffer = await sharp(room)
    .composite([
      { input: cutout, left, top: top - 40 },
      {
        input: reflection,
        left: Math.round((CANVAS_W - rw) / 2),
        top: top + ph - 20,
        blend: "over",
      },
    ])
    .jpeg({ quality: 90 })
    .toBuffer();

  return { buffer, mode };
}
