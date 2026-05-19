import { NextResponse } from "next/server";

const REMBG_URL = process.env.REMBG_SERVICE_URL ?? "http://localhost:8000";

export async function GET() {
  try {
    const res = await fetch(`${REMBG_URL}/health`, {
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) throw new Error("not ok");
    return NextResponse.json({ ok: true, mode: "rembg" });
  } catch {
    return NextResponse.json({ ok: false, mode: "fallback" });
  }
}
