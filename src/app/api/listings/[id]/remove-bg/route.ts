import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { getDemoIdFromCookie, getOrCreateUserByDemoId } from "@/lib/session";
import { consumeBgCredit } from "@/lib/credits";
import { trimProductForPreview } from "@/lib/image-framing";
import { removeBackground } from "@/lib/rembg";
import { saveUpload } from "@/lib/storage";
import { parseListingMetadata } from "@/lib/listing-meta";
import { prisma } from "@/lib/prisma";

export async function POST(
  _req: NextRequest,
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

  try {
    await consumeBgCredit(user.id);
  } catch {
    return NextResponse.json(
      { error: "BG_CREDITS_EXHAUSTED", message: "Ücretsiz arka plan hakkın bitti." },
      { status: 402 }
    );
  }

  const abs = path.join(process.cwd(), "public", listing.originalImagePath);
  const input = await readFile(abs);
  const { buffer: output, mode: bgMode } = await removeBackground(input);
  const trimmed = await trimProductForPreview(output);
  const processedPath = await saveUpload(trimmed, `processed-${id}.png`);

  await prisma.agentRun.create({
    data: {
      listingId: id,
      agent: "BackgroundRemove",
      status: "completed",
      output: JSON.stringify({ processedPath, bgMode }),
    },
  });

  const meta = {
    ...parseListingMetadata(listing.metadata),
    cutoutImagePath: processedPath,
  };

  const updated = await prisma.listing.update({
    where: { id },
    data: {
      processedImagePath: processedPath,
      status: "processed",
      metadata: JSON.stringify(meta),
    },
  });

  const freshUser = await prisma.user.findUniqueOrThrow({
    where: { id: user.id },
  });

  return NextResponse.json({
    listing: updated,
    processedImagePath: processedPath,
    bgCreditsRemaining: freshUser.bgCreditsRemaining,
    bgMode,
  });
}
