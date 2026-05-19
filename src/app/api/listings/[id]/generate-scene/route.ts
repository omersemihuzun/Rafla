import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { z } from "zod";
import { getDemoIdFromCookie, getOrCreateUserByDemoId } from "@/lib/session";
import { consumeSceneCredits } from "@/lib/credits";
import { parseListingMetadata } from "@/lib/listing-meta";
import {
  renderProductScene,
  sceneCreditCost,
  type SceneStyle,
} from "@/lib/scene";
import { saveUpload } from "@/lib/storage";
import { prisma } from "@/lib/prisma";

const bodySchema = z.object({
  style: z.enum(["white", "flat", "mirror", "model"]),
  clothingType: z.string().optional(),
  extraDescription: z.string().optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const demoId = await getDemoIdFromCookie();
  if (!demoId) {
    return NextResponse.json({ error: "NO_SESSION" }, { status: 401 });
  }

  let style: SceneStyle;
  let clothingType: string | undefined;
  let extraDescription: string | undefined;
  try {
    const json = await req.json();
    const parsed = bodySchema.parse(json);
    style = parsed.style;
    clothingType = parsed.clothingType;
    extraDescription = parsed.extraDescription;
  } catch {
    return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 });
  }

  const user = await getOrCreateUserByDemoId(demoId);
  const listing = await prisma.listing.findFirst({
    where: { id, userId: user.id },
  });

  if (!listing) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }

  const cost = sceneCreditCost(style);
  try {
    await consumeSceneCredits(user.id, cost);
  } catch {
    return NextResponse.json(
      {
        error: "SCENE_CREDITS_EXHAUSTED",
        message:
          cost > 1
            ? `Bu sahne için ${cost} kredi gerekir.`
            : "Sahne kredin bitti.",
      },
      { status: 402 }
    );
  }

  const sourceRel =
    listing.processedImagePath ?? listing.originalImagePath;
  const abs = path.join(process.cwd(), "public", sourceRel.replace(/^\//, ""));
  let input: Buffer;
  try {
    input = await readFile(abs);
  } catch {
    return NextResponse.json(
      { error: "FILE_NOT_FOUND", message: "Görsel dosyası bulunamadı." },
      { status: 404 }
    );
  }

  const hasAlpha =
    sourceRel.endsWith(".png") && Boolean(listing.processedImagePath);
  const mimeType = sourceRel.endsWith(".png") ? "image/png" : "image/jpeg";

  try {
    const { buffer, mode } = await renderProductScene(
      input,
      style,
      hasAlpha,
      { clothingType, extraDescription },
      mimeType
    );

    if (buffer.length < 2048) {
      throw new Error("Üretilen görsel boş veya geçersiz. Tekrar deneyin.");
    }
    const ext = style === "white" ? "png" : "jpg";
    const scenePath = await saveUpload(
      buffer,
      `scene-${style}-${id}.${ext}`
    );

    const meta = {
      ...parseListingMetadata(listing.metadata),
      sceneImagePath: scenePath,
      sceneStyle: style,
    };

    await prisma.agentRun.create({
      data: {
        listingId: id,
        agent: "SceneAgent",
        status: "completed",
        input: JSON.stringify({ style }),
        output: JSON.stringify({ scenePath, mode }),
      },
    });

    let updated;
    try {
      updated = await prisma.listing.update({
        where: { id },
        data: {
          sceneImagePath: scenePath,
          sceneStyle: style,
          processedImagePath: scenePath,
          status: "processed",
          metadata: JSON.stringify(meta),
        },
      });
    } catch {
      updated = await prisma.listing.update({
        where: { id },
        data: {
          processedImagePath: scenePath,
          status: "processed",
          metadata: JSON.stringify(meta),
        },
      });
    }

    const freshUser = await prisma.user.findUniqueOrThrow({
      where: { id: user.id },
    });

    return NextResponse.json({
      listing: updated,
      sceneImagePath: scenePath,
      sceneCredits: freshUser.sceneCredits,
      style,
      mode,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Sahne üretilemedi";
    return NextResponse.json(
      {
        error: "SCENE_FAILED",
        message: msg.includes("prisma")
          ? "Görsel işlendi ama kayıt hatası. Sayfayı yenileyip tekrar dene."
          : msg,
      },
      { status: 500 }
    );
  }
}
