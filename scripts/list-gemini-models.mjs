/**
 * API anahtarınızdaki Gemini modellerini listeler (görsel üretim adayları vurgulanır).
 * Kullanım: node scripts/list-gemini-models.mjs
 */
import { readFileSync } from "fs";
import { resolve } from "path";

function loadKey() {
  const envPath = resolve(process.cwd(), ".env");
  const raw = readFileSync(envPath, "utf8");
  const line = raw.split("\n").find((l) => l.startsWith("GEMINI_API_KEY="));
  if (!line) throw new Error(".env içinde GEMINI_API_KEY yok");
  return line.split("=").slice(1).join("=").trim().replace(/^["']|["']$/g, "");
}

const key = loadKey();
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(key)}`;
const res = await fetch(url);
if (!res.ok) {
  console.error("API hata:", res.status, await res.text());
  process.exit(1);
}

const { models = [] } = await res.json();
const imageLike = (name) =>
  /image|imagen|flash.*image|image.*flash/i.test(name);

console.log("\n=== Görsel üretim adayları ===\n");
for (const m of models) {
  const id = m.name?.replace("models/", "") ?? "";
  if (!imageLike(id)) continue;
  const methods = m.supportedGenerationMethods?.join(", ") ?? "";
  console.log(`  ${id}`);
  if (methods) console.log(`    methods: ${methods}`);
}

console.log("\n=== Metin (ilan) modelleri (örnek) ===\n");
for (const m of models) {
  const id = m.name?.replace("models/", "") ?? "";
  if (!/gemini-2\.[05]|gemini-2\.0-flash(?!.*image)/i.test(id)) continue;
  if (imageLike(id)) continue;
  console.log(`  ${id}`);
}

console.log(
  "\n.env örneği:\n  GEMINI_IMAGE_MODEL=gemini-2.0-flash-preview-image-generation\n"
);
