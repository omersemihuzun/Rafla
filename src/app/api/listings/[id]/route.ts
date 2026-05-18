import { NextRequest, NextResponse } from "next/server";
import { getDemoIdFromCookie, getOrCreateUserByDemoId } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET(
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
    include: { agentRuns: { orderBy: { createdAt: "asc" } } },
  });

  if (!listing) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }

  return NextResponse.json({ listing });
}
