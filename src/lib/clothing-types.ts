export const CLOTHING_TYPES = [
  { id: "ust", label: "Üst" },
  { id: "alt", label: "Alt" },
  { id: "etek", label: "Etek" },
  { id: "elbise", label: "Elbise" },
  { id: "sapka", label: "Şapka" },
  { id: "ayakkabi", label: "Ayakkabı" },
  { id: "canta", label: "Çanta" },
  { id: "diger", label: "Diğer" },
] as const;

export type ClothingTypeId = (typeof CLOTHING_TYPES)[number]["id"];

const CATEGORY_MAP: Record<string, ClothingTypeId> = {
  üst: "ust",
  ust: "ust",
  alt: "alt",
  etek: "etek",
  elbise: "elbise",
  ayakkabı: "ayakkabi",
  ayakkabi: "ayakkabi",
  çanta: "canta",
  canta: "canta",
  aksesuar: "diger",
  diğer: "diger",
  diger: "diger",
};

export function categoryToClothingId(category?: string): ClothingTypeId | null {
  if (!category) return null;
  const key = category.trim().toLowerCase();
  return CATEGORY_MAP[key] ?? null;
}

export function clothingTypeLabel(id: ClothingTypeId | null): string | undefined {
  if (!id) return undefined;
  return CLOTHING_TYPES.find((t) => t.id === id)?.label;
}
