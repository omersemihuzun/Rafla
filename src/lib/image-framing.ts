import sharp from "sharp";

export const CATALOG_W = 1200;
export const CATALOG_H = 1600;
/** Ürünün katalog karesinde kapladığı yükseklik oranı */
const FILL_RATIO = 0.88;

/**
 * Kesilmiş ürünü vitrin önizlemesine oturtur — önce/sonra kaydırıcıda küçük görünme sorununu azaltır.
 */
/** Önce/sonra kaydırıcı — büyük beyaz kanvas yok, ürün kadrajı korunur */
export async function trimProductForPreview(input: Buffer): Promise<Buffer> {
  let product = input;
  const meta = await sharp(input).metadata();

  if (meta.hasAlpha) {
    try {
      const trimmed = await sharp(input).trim({ threshold: 12 }).toBuffer();
      const t = await sharp(trimmed).metadata();
      if ((t.width ?? 0) > 40 && (t.height ?? 0) > 40) {
        product = trimmed;
      }
    } catch {
      /* keep original */
    }
  }

  const maxSide = 1600;
  return sharp(product)
    .resize(maxSide, maxSide, { fit: "inside", withoutEnlargement: false })
    .png()
    .toBuffer();
}

export async function frameProductForCatalog(
  input: Buffer,
  background: { r: number; g: number; b: number } = { r: 255, g: 255, b: 255 }
): Promise<Buffer> {
  let product = input;
  const meta = await sharp(input).metadata();

  if (meta.hasAlpha) {
    try {
      const trimmed = await sharp(input).trim({ threshold: 12 }).toBuffer();
      const t = await sharp(trimmed).metadata();
      if ((t.width ?? 0) > 40 && (t.height ?? 0) > 40) {
        product = trimmed;
      }
    } catch {
      /* trim desteklenmiyorsa orijinal */
    }
  }

  const targetH = Math.round(CATALOG_H * FILL_RATIO);
  const targetW = Math.round(CATALOG_W * FILL_RATIO);

  const resized = await sharp(product)
    .resize(targetW, targetH, {
      fit: "inside",
      withoutEnlargement: false,
    })
    .png()
    .toBuffer();

  const { width: rw = 0, height: rh = 0 } = await sharp(resized).metadata();

  return sharp({
    create: {
      width: CATALOG_W,
      height: CATALOG_H,
      channels: 3,
      background,
    },
  })
    .composite([
      {
        input: resized,
        left: Math.round((CATALOG_W - rw) / 2),
        top: Math.round((CATALOG_H - rh) / 2),
      },
    ])
    .jpeg({ quality: 92 })
    .toBuffer();
}

/** Manken çıktısı — figür daha küçük, çerçevede uzak kadraj */
export async function frameModelForCatalog(input: Buffer): Promise<Buffer> {
  let subject = input;
  try {
    const trimmed = await sharp(input).trim({ threshold: 18 }).toBuffer();
    const t = await sharp(trimmed).metadata();
    if ((t.width ?? 0) > 80 && (t.height ?? 0) > 120) {
      subject = trimmed;
    }
  } catch {
    /* keep */
  }

  const fillRatio = 0.82;
  const targetH = Math.round(CATALOG_H * fillRatio);
  const targetW = Math.round(CATALOG_W * fillRatio);

  const resized = await sharp(subject)
    .resize(targetW, targetH, {
      fit: "inside",
      withoutEnlargement: false,
    })
    .jpeg({ quality: 92 })
    .toBuffer();

  const { width: rw = 0, height: rh = 0 } = await sharp(resized).metadata();

  return sharp({
    create: {
      width: CATALOG_W,
      height: CATALOG_H,
      channels: 3,
      background: { r: 240, g: 240, b: 242 },
    },
  })
    .composite([
      {
        input: resized,
        left: Math.round((CATALOG_W - rw) / 2),
        top: Math.round((CATALOG_H - rh) / 2),
      },
    ])
    .jpeg({ quality: 92 })
    .toBuffer();
}
