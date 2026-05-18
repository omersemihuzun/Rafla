import { mkdir, writeFile } from "fs/promises";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export async function saveUpload(
  buffer: Buffer,
  filename: string
): Promise<string> {
  await mkdir(UPLOAD_DIR, { recursive: true });
  const safe = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
  const fullPath = path.join(UPLOAD_DIR, safe);
  await writeFile(fullPath, buffer);
  return `/uploads/${safe}`;
}
