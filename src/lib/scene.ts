import sharp from "sharp";
import type { ClothingTypeId } from "./clothing-types";
import { resolveGarmentContext } from "./garment-context";
import { CATALOG_H, CATALOG_W, frameModelForCatalog } from "./image-framing";
import { generateAiSceneImage } from "./gemini-image";
import { removeBackground } from "./rembg";
import type { SceneStyle } from "./scene-types";

export type SceneRenderHints = {
  clothingType?: string;
  clothingTypeId?: ClothingTypeId;
  extraDescription?: string;
};

export type { SceneStyle } from "./scene-types";
export { sceneCreditCost, isAiSceneStyle } from "./scene-types";

const CANVAS_W = CATALOG_W;
const CANVAS_H = CATALOG_H;

async function prepareCutout(
  imageBuffer: Buffer,
  hasAlpha: boolean
): Promise<{ cutout: Buffer; pw: number; ph: number; mode: string }> {
  let product = imageBuffer;
  let mode: string = hasAlpha ? "existing" : "fallback";

  if (!hasAlpha) {
    const bg = await removeBackground(imageBuffer);
    product = bg.buffer;
    mode = bg.mode;
  }

  const maxH = Math.round(CANVAS_H * 0.88);
  const maxW = Math.round(CANVAS_W * 0.92);
  const cutout = await sharp(product)
    .resize(maxW, maxH, { fit: "inside", withoutEnlargement: false })
    .png()
    .toBuffer();

  const { width: pw = 800, height: ph = 900 } = await sharp(cutout).metadata();
  return { cutout, pw, ph, mode };
}

async function prepareProductPng(imageBuffer: Buffer): Promise<Buffer> {
  try {
    const bg = await removeBackground(imageBuffer);
    return bg.buffer;
  } catch {
    return imageBuffer;
  }
}

function resolveCtx(hints?: SceneRenderHints) {
  return resolveGarmentContext({
    clothingTypeId: hints?.clothingTypeId,
    clothingType: hints?.clothingType,
    extraDescription: hints?.extraDescription,
  });
}

async function renderRetailHangingFromInput(
  imageBuffer: Buffer,
  hasAlpha: boolean,
  hints?: SceneRenderHints
): Promise<{ buffer: Buffer; mode: string }> {
  const ctx = resolveCtx(hints);
  const { cutout, pw, ph, mode } = await prepareCutout(imageBuffer, hasAlpha);
  const buffer = await renderHangingScene(cutout, pw, ph, {
    small: ctx.isSmallGarment,
  });
  return { buffer, mode: `retail-hanger-${mode}` };
}

export async function renderModelScene(
  imageBuffer: Buffer,
  _mimeType: string,
  hints?: SceneRenderHints
): Promise<{ buffer: Buffer; mode: string }> {
  const ctx = resolveCtx(hints);
  if (!ctx.allowPersonScenes) {
    return renderRetailHangingFromInput(imageBuffer, false, hints);
  }

  const product = await prepareProductPng(imageBuffer);
  const base64 = product.toString("base64");
  const raw = await generateAiSceneImage(base64, "image/png", {
    promptGarment: ctx.promptGarment,
    ageGroup: ctx.ageGroup,
    extraDescription: hints?.extraDescription,
    style: "model",
  });
  const buffer = await frameModelForCatalog(raw);
  return { buffer, mode: "gemini" };
}

export async function renderMirrorScene(
  imageBuffer: Buffer,
  _mimeType: string,
  hints?: SceneRenderHints
): Promise<{ buffer: Buffer; mode: string }> {
  const ctx = resolveCtx(hints);
  if (!ctx.allowPersonScenes) {
    return renderRetailHangingFromInput(imageBuffer, false, hints);
  }

  const product = await prepareProductPng(imageBuffer);
  const base64 = product.toString("base64");
  const raw = await generateAiSceneImage(base64, "image/png", {
    promptGarment: ctx.promptGarment,
    ageGroup: ctx.ageGroup,
    extraDescription: hints?.extraDescription,
    style: "mirror",
  });
  const buffer = await frameModelForCatalog(raw);
  return { buffer, mode: "gemini" };
}

async function renderFlatLayScene(
  cutout: Buffer,
  pw: number,
  ph: number
): Promise<Buffer> {
  const targetW = Math.round(CANVAS_W * 0.82);
  const targetH = Math.round(CANVAS_H * 0.72);
  const scaled = await sharp(cutout)
    .resize(targetW, targetH, { fit: "inside", withoutEnlargement: false })
    .png()
    .toBuffer();
  const { width: sw = pw, height: sh = ph } = await sharp(scaled).metadata();
  const left = Math.round((CANVAS_W - sw) / 2);
  const top = Math.round(CANVAS_H * 0.36 - sh / 2);

  const shadowW = Math.min(Math.round(sw * 1.15), CANVAS_W - 80);
  const shadow = await sharp({
    create: {
      width: shadowW,
      height: 36,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0.14 },
    },
  })
    .blur(10)
    .png()
    .toBuffer();

  const floor = await sharp({
    create: {
      width: CANVAS_W,
      height: CANVAS_H,
      channels: 3,
      background: { r: 242, g: 242, b: 245 },
    },
  })
    .linear(1.02, -4)
    .jpeg()
    .toBuffer();

  return sharp(floor)
    .composite([
      {
        input: shadow,
        left: Math.round((CANVAS_W - shadowW) / 2),
        top: Math.min(top + sh - 8, CANVAS_H - 50),
      },
      { input: scaled, left, top: Math.max(40, top) },
    ])
    .jpeg({ quality: 92 })
    .toBuffer();
}

async function renderHangingScene(
  cutout: Buffer,
  pw: number,
  ph: number,
  opts?: { small?: boolean }
): Promise<Buffer> {
  const fill = opts?.small ? 0.8 : 0.76;
  const targetH = Math.round(CANVAS_H * fill);
  const targetW = Math.round(CANVAS_W * 0.88);

  const scaled = await sharp(cutout)
    .resize(targetW, targetH, { fit: "inside", withoutEnlargement: false })
    .png()
    .toBuffer();
  const { width: sw = pw, height: sh = ph } = await sharp(scaled).metadata();

  const hookY = opts?.small ? 140 : 120;
  const productTop = hookY + (opts?.small ? 52 : 58);
  const left = Math.round((CANVAS_W - sw) / 2);

  const hangerSvg = Buffer.from(
    `<svg width="240" height="100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="hook" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#9ca3af"/>
          <stop offset="100%" stop-color="#6b7280"/>
        </linearGradient>
      </defs>
      <rect x="116" y="0" width="8" height="22" rx="2" fill="url(#hook)"/>
      <path d="M28 78 Q120 18 212 78" fill="none" stroke="#d1d5db" stroke-width="4" stroke-linecap="round"/>
      <path d="M36 76 Q120 22 204 76" fill="none" stroke="#e5e7eb" stroke-width="2" stroke-linecap="round"/>
    </svg>`
  );
  const hanger = await sharp(hangerSvg).png().toBuffer();
  const hw = (await sharp(hanger).metadata()).width ?? 240;

  const shadowW = Math.min(Math.round(sw * 1.05), CANVAS_W - 120);
  const shadow = await sharp({
    create: {
      width: shadowW,
      height: 28,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0.07 },
    },
  })
    .blur(12)
    .png()
    .toBuffer();

  const studio = await sharp({
    create: {
      width: CANVAS_W,
      height: CANVAS_H,
      channels: 3,
      background: { r: 255, g: 255, b: 255 },
    },
  })
    .linear(1.01, -2)
    .jpeg({ quality: 96 })
    .toBuffer();

  return sharp(studio)
    .composite([
      {
        input: shadow,
        left: Math.round((CANVAS_W - shadowW) / 2),
        top: Math.min(productTop + sh + 6, CANVAS_H - 48),
      },
      {
        input: hanger,
        left: Math.round((CANVAS_W - hw) / 2),
        top: hookY,
      },
      { input: scaled, left, top: productTop },
    ])
    .jpeg({ quality: 94 })
    .toBuffer();
}

export async function renderProductScene(
  imageBuffer: Buffer,
  style: SceneStyle,
  hasAlpha: boolean,
  hints?: SceneRenderHints,
  mimeType = "image/jpeg"
): Promise<{ buffer: Buffer; mode: string }> {
  if (style === "model") {
    return renderModelScene(imageBuffer, mimeType, hints);
  }
  if (style === "mirror") {
    return renderMirrorScene(imageBuffer, mimeType, hints);
  }

  const { cutout, pw, ph, mode } = await prepareCutout(imageBuffer, hasAlpha);
  const left = Math.round((CANVAS_W - pw) / 2);
  const top = Math.round((CANVAS_H - ph) / 2);

  if (style === "hanging") {
    const ctx = resolveCtx(hints);
    const buffer = await renderHangingScene(cutout, pw, ph, {
      small: ctx.isSmallGarment,
    });
    return { buffer, mode: `retail-hanger-${mode}` };
  }

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
    const buffer = await renderFlatLayScene(cutout, pw, ph);
    return { buffer, mode };
  }

  return renderMirrorScene(imageBuffer, mimeType, hints);
}
