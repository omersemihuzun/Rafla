/** UI / API için güvenli hata metni — [object Event] vb. engeller */
export function toErrorMessage(err: unknown, fallback = "Bir hata oluştu"): string {
  if (err instanceof Error && err.message) return err.message;
  if (typeof err === "string" && err.trim()) return err;
  if (err && typeof err === "object") {
    const o = err as { message?: unknown; error?: unknown };
    if (typeof o.message === "string" && o.message.trim()) return o.message;
    if (typeof o.error === "string" && o.error.trim()) return o.error;
  }
  return fallback;
}

export function apiErrorMessage(
  data: { message?: unknown; error?: unknown },
  fallback: string
): string {
  if (typeof data.message === "string" && data.message.trim()) return data.message;
  if (typeof data.error === "string" && data.error.trim()) return data.error;
  return fallback;
}
