/**
 * Landing / demo için örnek görselleri public/samples/ altına indirir.
 */
import { copyFile, mkdir, writeFile } from "fs/promises";
import { resolve } from "path";

const OUT = resolve(process.cwd(), "public", "samples");

/** @type {{ file: string; url: string }[]} */
const ASSETS = [
  {
    file: "hero-before.jpg",
    url: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=640&h=800&q=80",
  },
  {
    file: "hero-after.jpg",
    url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=640&h=800&q=80",
  },
  {
    file: "benefit-before.jpg",
    url: "https://images.unsplash.com/photo-1558618666-fcd25c85f82f?auto=format&fit=crop&w=800&h=600&q=80",
  },
  {
    file: "benefit-after.jpg",
    url: "https://images.unsplash.com/photo-1562157873-818bc0526dd4?auto=format&fit=crop&w=800&h=600&q=80",
  },
  {
    file: "demo-garment.jpg",
    url: "https://images.unsplash.com/photo-1595777457583-95e0597c7b8c?auto=format&fit=crop&w=1200&h=1600&q=85",
  },
  {
    file: "bento-bg.jpg",
    url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&h=600&q=80",
  },
  {
    file: "bento-model.jpg",
    url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&h=600&q=80",
  },
  {
    file: "upload-thumb.jpg",
    url: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=400&h=400&q=80",
  },
];

await mkdir(OUT, { recursive: true });

const saved = new Map();

for (const { file, url } of ASSETS) {
  const dest = resolve(OUT, file);
  process.stdout.write(`→ ${file} … `);
  try {
    const res = await fetch(url, {
      redirect: "follow",
      headers: { "User-Agent": "Rafla/1.0 (demo assets)" },
    });
    if (!res.ok) throw new Error(String(res.status));
    const buf = Buffer.from(await res.arrayBuffer());
    await writeFile(dest, buf);
    saved.set(file, dest);
    console.log(`${Math.round(buf.length / 1024)} KB`);
  } catch (e) {
    console.log(`HATA (${e instanceof Error ? e.message : e})`);
  }
}

const fallback = saved.get("hero-before.jpg") ?? saved.get("hero-after.jpg");
if (fallback) {
  for (const { file } of ASSETS) {
    if (!saved.has(file)) {
      await copyFile(fallback, resolve(OUT, file));
      console.log(`↪ ${file} ← yedek kopya`);
    }
  }
}

console.log("\nTamam:", OUT);
