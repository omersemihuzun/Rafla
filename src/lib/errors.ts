export function friendlyApiError(message: string): string {
  if (
    message.includes("Unknown argument") ||
    message.includes("prisma") ||
    message.includes("Invalid `prisma")
  ) {
    return "Geçici sunucu hatası. Geliştirme sunucusunu durdurup yeniden başlatın.";
  }
  if (message.includes("SCENE_CREDITS_EXHAUSTED")) {
    return "Sahne kredin bitti. Fiyatlandırma sayfasından paket alabilirsin.";
  }
  if (message.length > 120) {
    return message.slice(0, 120) + "…";
  }
  return message;
}
