import { NextRequest, NextResponse } from "next/server";
import { getDemoIdFromCookie, getOrCreateUserByDemoId } from "@/lib/session";
import { buyerPersonaReview } from "@/lib/gemini";
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

  if (!listing?.title || !listing.description) {
    return NextResponse.json(
      {
        error: "LISTING_NOT_READY",
        message: "Önce Ürünü analiz et ve Dolap/Gardrops metni oluştur.",
      },
      { status: 400 }
    );
  }

  const run = await prisma.agentRun.create({
    data: { listingId: id, agent: "ReviewAgent", status: "running" },
  });

  try {
    const review = await buyerPersonaReview(
      listing.title,
      listing.description
    );

    await prisma.agentRun.update({
      where: { id: run.id },
      data: { status: "completed", output: JSON.stringify(review) },
    });

    return NextResponse.json({ review });
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Alıcı önizlemesi oluşturulamadı";
    await prisma.agentRun.update({
      where: { id: run.id },
      data: { status: "failed", error: message },
    });
    return NextResponse.json(
      { error: "REVIEW_FAILED", message },
      { status: 503 }
    );
  }
}
