import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { getDemoIdFromCookie, getOrCreateUserByDemoId } from "@/lib/session";
import { analyzeGarment } from "@/lib/gemini";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const demoId = await getDemoIdFromCookie();
  if (!demoId) {
    return NextResponse.json({ error: "NO_SESSION" }, { status: 401 });
  }

  const user = await getOrCreateUserByDemoId(demoId);
  const listing = await prisma.listing.findFirst({
    where: { id, userId: user.id },
  });

  if (!listing) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }

  const imageRel =
    listing.processedImagePath ?? listing.originalImagePath;
  const abs = path.join(process.cwd(), "public", imageRel);
  const buffer = await readFile(abs);
  const base64 = buffer.toString("base64");
  const ext = path.extname(abs).toLowerCase();
  const mime =
    ext === ".png"
      ? "image/png"
      : ext === ".webp"
        ? "image/webp"
        : "image/jpeg";

  const run = await prisma.agentRun.create({
    data: { listingId: id, agent: "VisionAgent", status: "running" },
  });

  const body = await req.json().catch(() => ({}));
  const hints = {
    clothingType:
      typeof body.clothingType === "string" ? body.clothingType : undefined,
    extraDescription:
      typeof body.extraDescription === "string"
        ? body.extraDescription
        : undefined,
  };

  try {
    const analysis = await analyzeGarment(base64, mime, hints);

    await prisma.agentRun.update({
      where: { id: run.id },
      data: {
        status: "completed",
        output: JSON.stringify(analysis),
      },
    });

    await prisma.listing.update({
      where: { id },
      data: {
        metadata: JSON.stringify(analysis),
        title: String(analysis.suggestedTitle ?? ""),
        status: "analyzed",
      },
    });

    return NextResponse.json({ analysis, agentRunId: run.id });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Analysis failed";
    await prisma.agentRun.update({
      where: { id: run.id },
      data: { status: "failed", error: message },
    });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
