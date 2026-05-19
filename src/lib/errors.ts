import { toErrorMessage } from "./to-error-message";

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
  if (
    message.includes("GoogleGenerativeAI") ||
    message.includes("generativelanguage") ||
    message.includes("AI görsel üretilemedi")
  ) {
    return "AI manken/ayna modeli şu an yanıt vermiyor. .env içine GEMINI_IMAGE_MODEL=gemini-2.0-flash-preview-image-generation ekleyin veya Beyaz fon / Askıda kullanın.";
  }
  if (message.length > 160) {
    return message.slice(0, 160) + "…";
  }
  return message;
}

export function friendlyUnknownError(err: unknown, fallback = "Bir hata oluştu"): string {
  return friendlyApiError(toErrorMessage(err, fallback));
}
