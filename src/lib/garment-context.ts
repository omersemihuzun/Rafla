import type { ClothingTypeId } from "./clothing-types";

export type GarmentAgeGroup = "baby" | "child" | "adult";

export type GarmentContext = {
  ageGroup: GarmentAgeGroup;
  /** AI promptlarında kullanılacak net ürün tanımı */
  promptGarment: string;
  /** Manken / ayna selfie uygun mu */
  allowPersonScenes: boolean;
  isSmallGarment: boolean;
  /** Kullanıcıya gösterilecek kısa not */
  personSceneBlockReason?: string;
};

const BABY_RE =
  /bebek|baby|yenidoğan|yeni\s*doğan|0-3\s*ay|zıbın|tulum|onesie|romper|patik|0-6\s*ay|6-12\s*ay/i;
const CHILD_RE =
  /çocuk|kids|kid\b|2-6\s*yaş|3-6\s*yaş|4-8\s*yaş|okul\s*öncesi|minik/i;

const TYPE_EN: Record<ClothingTypeId, string> = {
  ust: "top / blouse / shirt",
  alt: "bottom / pants / trousers",
  etek: "skirt",
  elbise: "dress",
  sapka: "hat / cap",
  ayakkabi: "shoes",
  canta: "bag",
  diger: "clothing item",
  bebek: "baby clothing (romper, bodysuit, onesie, dress, set — infant size)",
};

export function resolveGarmentContext(input: {
  clothingTypeId?: ClothingTypeId | null;
  clothingType?: string | null;
  extraDescription?: string | null;
}): GarmentContext {
  const extra = (input.extraDescription ?? "").trim();
  const id = input.clothingTypeId ?? null;
  const label = (input.clothingType ?? "").trim();
  const combined = `${label} ${extra}`.toLowerCase();

  let ageGroup: GarmentAgeGroup = "adult";
  if (id === "bebek" || BABY_RE.test(combined)) {
    ageGroup = "baby";
  } else if (CHILD_RE.test(combined)) {
    ageGroup = "child";
  }

  const typePart = id ? TYPE_EN[id] : label || "clothing item";
  const promptGarment = extra
    ? `${typePart}. Seller description: ${extra}`
    : typePart;

  const allowPersonScenes = ageGroup === "adult";
  const isSmallGarment = ageGroup === "baby" || ageGroup === "child";

  let personSceneBlockReason: string | undefined;
  if (!allowPersonScenes) {
    personSceneBlockReason =
      ageGroup === "baby"
        ? "Bebek ürünleri için Beyaz vitrin veya Askıda kullanın; AI kişi sahnesi yetişkin ürüne dönüşebilir."
        : "Çocuk ürünleri için vitrin (askıda / beyaz fon) daha doğru sonuç verir.";
  }

  return {
    ageGroup,
    promptGarment,
    allowPersonScenes,
    isSmallGarment,
    personSceneBlockReason,
  };
}

/** Kesilmiş görsel çok küçükse (bebek elbisesi vb.) */
export function inferSmallGarmentFromCutout(pw: number, ph: number): boolean {
  const area = pw * ph;
  const maxSide = Math.max(pw, ph);
  return maxSide < 520 || area < 180_000;
}
