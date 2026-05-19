export type ListingSceneMeta = {
  sceneImagePath?: string;
  sceneStyle?: string;
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

export function scenePathFromListing(listing: {
  sceneImagePath?: string | null;
  processedImagePath?: string | null;
  metadata?: string | null;
}): string | null {
  if (listing.sceneImagePath) return listing.sceneImagePath;
  const meta = parseListingMetadata(listing.metadata);
  if (typeof meta.sceneImagePath === "string") return meta.sceneImagePath;
  return listing.processedImagePath ?? null;
}
