import type { SceneStyle } from "./scene-types";

export type SceneGalleryItem = {
  path: string;
  style: SceneStyle;
  label: string;
  mode?: string;
};

export const SCENE_STYLE_LABELS: Record<SceneStyle, string> = {
  white: "Beyaz fon",
  flat: "Düz sergi",
  hanging: "Askıda",
  mirror: "Ayna selfie",
  model: "Manken",
};

export const VITRIN_PACK_STYLES: SceneStyle[] = ["white", "flat", "hanging"];
export const VITRIN_PACK_CREDIT_COST = 2;

export function parseSceneGallery(metadata: string | null | undefined): SceneGalleryItem[] {
  if (!metadata) return [];
  try {
    const raw = JSON.parse(metadata) as Record<string, unknown>;
    const arr = raw.sceneGallery;
    if (!Array.isArray(arr)) return [];
    return arr
      .map((item) => {
        if (!item || typeof item !== "object") return null;
        const o = item as Record<string, unknown>;
        const style = o.style as SceneStyle;
        const path = typeof o.path === "string" ? o.path : "";
        if (!path || !SCENE_STYLE_LABELS[style]) return null;
        return {
          path,
          style,
          label:
            typeof o.label === "string" ? o.label : SCENE_STYLE_LABELS[style],
          mode: typeof o.mode === "string" ? o.mode : undefined,
        };
      })
      .filter((x): x is SceneGalleryItem => x !== null);
  } catch {
    return [];
  }
}

export function upsertSceneGalleryItem(
  gallery: SceneGalleryItem[],
  item: SceneGalleryItem
): SceneGalleryItem[] {
  const idx = gallery.findIndex((g) => g.style === item.style);
  if (idx >= 0) {
    const next = [...gallery];
    next[idx] = item;
    return next;
  }
  return [...gallery, item];
}

export function mergeSceneGalleryIntoMeta(
  metadata: string | null | undefined,
  gallery: SceneGalleryItem[],
  primary?: { sceneImagePath: string; sceneStyle: SceneStyle },
  preserve?: { cutoutImagePath?: string | null }
): string {
  const base = parseListingMetaRaw(metadata);
  const cutout =
    preserve?.cutoutImagePath ??
    (typeof base.cutoutImagePath === "string" ? base.cutoutImagePath : undefined);
  return JSON.stringify({
    ...base,
    sceneGallery: gallery,
    ...(cutout ? { cutoutImagePath: cutout } : {}),
    ...(primary
      ? { sceneImagePath: primary.sceneImagePath, sceneStyle: primary.sceneStyle }
      : {}),
  });
}

function parseListingMetaRaw(metadata: string | null | undefined): Record<string, unknown> {
  if (!metadata) return {};
  try {
    return JSON.parse(metadata) as Record<string, unknown>;
  } catch {
    return {};
  }
}

export function primaryFromGallery(
  gallery: SceneGalleryItem[],
  fallbackStyle?: SceneStyle
): SceneGalleryItem | null {
  if (gallery.length === 0) return null;
  if (fallbackStyle) {
    const found = gallery.find((g) => g.style === fallbackStyle);
    if (found) return found;
  }
  return gallery[gallery.length - 1];
}
