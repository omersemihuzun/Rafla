import { NextRequest, NextResponse } from "next/server";
import { getDemoIdFromCookie, getOrCreateUserByDemoId } from "@/lib/session";
import { generateListingCopy } from "@/lib/gemini";
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

  const body = await req.json().catch(() => ({}));
  const platform =
    body.platform === "gardrops" ? "gardrops" : "dolap";

  const analysis = listing.metadata
    ? (JSON.parse(listing.metadata) as Record<string, unknown>)
    : {};

  const run = await prisma.agentRun.create({
    data: { listingId: id, agent: "CopyAgent", status: "running" },
  });

  try {
    const copy = await generateListingCopy(analysis, platform);

    await prisma.agentRun.update({
      where: { id: run.id },
      data: { status: "completed", output: JSON.stringify(copy) },
    });

    await prisma.listing.update({
      where: { id },
      data: {
        platform,
        title: String(copy.title ?? listing.title ?? ""),
        description: String(copy.description ?? ""),
        qualityScore:
          typeof copy.qualityScore === "number"
            ? copy.qualityScore
            : null,
        status: "ready",
      },
    });

    return NextResponse.json({ copy, platform });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Copy failed";
    await prisma.agentRun.update({
      where: { id: run.id },
      data: { status: "failed", error: message },
    });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
