/**
 * Landing «Örnek fotoğrafla dene» için görselleri public/samples/ altına indirir.
 */
import { mkdir, writeFile } from "fs/promises";
import { resolve } from "path";

const OUT = resolve(process.cwd(), "public", "samples");

/** @type {{ file: string; url: string }[]} */
const ASSETS = [
  {
    file: "demo-garment.jpg",
    url: "https://images.unsplash.com/photo-1595777457583-95e0597c7b8c?auto=format&fit=crop&w=1200&h=1600&q=85",
  },
  {
    file: "upload-thumb.jpg",
    url: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=400&h=400&q=80",
  },
];

await mkdir(OUT, { recursive: true });

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
    console.log(`${Math.round(buf.length / 1024)} KB`);
  } catch (e) {
    console.log(`HATA (${e instanceof Error ? e.message : e})`);
  }
}

console.log("\nTamam:", OUT);
