import type { SceneStyle } from "./scene-types";
import { parseSceneGallery } from "./scene-gallery";

export type ListingSceneMeta = {
  sceneImagePath?: string;
  sceneStyle?: string;
  cutoutImagePath?: string;
};

export function parseListingMetadata(
  metadata: string | null | undefined
): Record<string, unknown> {
  if (!metadata) return {};
  try {
    return JSON.parse(metadata) as Record<string, unknown>;
  } catch {
    return {};
  }
}

/** Sadece remove-bg çıktısı; sahne dosyaları (scene-*) hariç */
export function isCutoutPath(path: string | null | undefined): boolean {
  if (!path) return false;
  const lower = path.toLowerCase();
  if (!lower.endsWith(".png")) return false;
  if (lower.includes("/scene-") || lower.includes("scene-")) return false;
  return lower.includes("processed-") || lower.includes("cutout");
}

export function cutoutPathFromListing(listing: {
  processedImagePath?: string | null;
  metadata?: string | null;
}): string | null {
  const meta = parseListingMetadata(listing.metadata);
  if (typeof meta.cutoutImagePath === "string" && isCutoutPath(meta.cutoutImagePath)) {
    return meta.cutoutImagePath;
  }
  if (isCutoutPath(listing.processedImagePath)) {
    return listing.processedImagePath ?? null;
  }
  return null;
}

/** Sahne üretiminde her zaman orijinal veya kesilmiş ürün — asla önceki sahne çıktısı değil */
export function resolveSceneInput(listing: {
  originalImagePath: string;
  processedImagePath?: string | null;
  metadata?: string | null;
}): { path: string; hasAlpha: boolean; mimeType: string } {
  const cutout = cutoutPathFromListing(listing);
  const path = cutout ?? listing.originalImagePath;
  return {
    path,
    hasAlpha: Boolean(cutout),
    mimeType: path.toLowerCase().endsWith(".png") ? "image/png" : "image/jpeg",
  };
}

export function scenePathFromListing(listing: {
  sceneImagePath?: string | null;
  metadata?: string | null;
}): string | null {
  if (listing.sceneImagePath) return listing.sceneImagePath;
  const meta = parseListingMetadata(listing.metadata);
  if (typeof meta.sceneImagePath === "string") return meta.sceneImagePath;
  return null;
}

/** Seçili stile ait kayıtlı sahne (galeri veya son üretim) */
export function scenePreviewForStyle(
  listing: {
    sceneImagePath?: string | null;
    sceneStyle?: string | null;
    metadata?: string | null;
  },
  style: SceneStyle
): string | null {
  const gallery = parseSceneGallery(listing.metadata);
  const fromGallery = gallery.find((g) => g.style === style);
  if (fromGallery) return fromGallery.path;

  if (listing.sceneStyle === style && listing.sceneImagePath) {
    return listing.sceneImagePath;
  }

  const meta = parseListingMetadata(listing.metadata);
  if (meta.sceneStyle === style && typeof meta.sceneImagePath === "string") {
    return meta.sceneImagePath;
  }

  return null;
}
