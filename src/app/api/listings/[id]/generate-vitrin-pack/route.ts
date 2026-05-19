import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { getDemoIdFromCookie, getOrCreateUserByDemoId } from "@/lib/session";
import { consumeSceneCredits, refundSceneCredits } from "@/lib/credits";
import {
  mergeSceneGalleryIntoMeta,
  parseSceneGallery,
  SCENE_STYLE_LABELS,
  upsertSceneGalleryItem,
  VITRIN_PACK_CREDIT_COST,
  VITRIN_PACK_STYLES,
  type SceneGalleryItem,
} from "@/lib/scene-gallery";
import { cutoutPathFromListing, resolveSceneInput } from "@/lib/listing-meta";
import { renderProductScene } from "@/lib/scene";
import { saveUpload } from "@/lib/storage";
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

  const cost = VITRIN_PACK_CREDIT_COST;
  try {
    await consumeSceneCredits(user.id, cost);
  } catch {
    return NextResponse.json(
      {
        error: "SCENE_CREDITS_EXHAUSTED",
        message: `Vitrin paketi için ${cost} sahne kredisi gerekir.`,
      },
      { status: 402 }
    );
  }

  const { path: sourceRel, hasAlpha, mimeType } = resolveSceneInput(listing);
  const abs = path.join(process.cwd(), "public", sourceRel.replace(/^\//, ""));
  let input: Buffer;
  try {
    input = await readFile(abs);
  } catch {
    await refundSceneCredits(user.id, cost).catch(() => {});
    return NextResponse.json(
      { error: "FILE_NOT_FOUND", message: "Görsel dosyası bulunamadı." },
      { status: 404 }
    );
  }

  const cutoutPath = cutoutPathFromListing(listing);

  let gallery = parseSceneGallery(listing.metadata);
  const generated: SceneGalleryItem[] = [];

  try {
    const ts = Date.now();
    const results = await Promise.all(
      VITRIN_PACK_STYLES.map(async (style) => {
        const { buffer, mode } = await renderProductScene(
          input,
          style,
          hasAlpha,
          undefined,
          mimeType
        );
        if (buffer.length < 2048) {
          throw new Error(`${style}: görsel üretilemedi`);
        }
        const ext = style === "white" ? "png" : "jpg";
        const scenePath = await saveUpload(
          buffer,
          `scene-${style}-${id}-${ts}.${ext}`
        );
        return {
          path: scenePath,
          style,
          label: SCENE_STYLE_LABELS[style],
          mode,
        } satisfies SceneGalleryItem;
      })
    );

    for (const item of results) {
      gallery = upsertSceneGalleryItem(gallery, item);
      generated.push(item);
    }

    const primary = generated[generated.length - 1];
    const meta = mergeSceneGalleryIntoMeta(listing.metadata, gallery, {
      sceneImagePath: primary.path,
      sceneStyle: primary.style,
    });

    await prisma.agentRun.create({
      data: {
        listingId: id,
        agent: "VitrinPack",
        status: "completed",
        output: JSON.stringify({ generated: generated.map((g) => g.style) }),
      },
    });

    let updated;
    try {
      updated = await prisma.listing.update({
        where: { id },
        data: {
          sceneImagePath: primary.path,
          sceneStyle: primary.style,
          status: "processed",
          metadata: meta,
        },
      });
    } catch {
      updated = await prisma.listing.update({
        where: { id },
        data: { status: "processed", metadata: meta },
      });
    }

    const freshUser = await prisma.user.findUniqueOrThrow({
      where: { id: user.id },
    });

    return NextResponse.json({
      listing: updated,
      gallery,
      generated,
      sceneCredits: freshUser.sceneCredits,
    });
  } catch (e) {
    await refundSceneCredits(user.id, cost).catch(() => {});
    const msg = e instanceof Error ? e.message : "Vitrin paketi üretilemedi";
    return NextResponse.json(
      { error: "VITRIN_PACK_FAILED", message: msg },
      { status: 500 }
    );
  }
}
