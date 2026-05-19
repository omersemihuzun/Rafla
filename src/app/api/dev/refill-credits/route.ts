import { NextResponse } from "next/server";
import { getDemoIdFromCookie, getOrCreateUserByDemoId } from "@/lib/session";
import { prisma } from "@/lib/prisma";

/** Sadece geliştirme — demo / hackathon provası için kredileri yeniler */
export async function POST() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "NOT_AVAILABLE" }, { status: 404 });
  }

  const demoId = await getDemoIdFromCookie();
  if (!demoId) {
    return NextResponse.json({ error: "NO_SESSION" }, { status: 401 });
  }

  const user = await getOrCreateUserByDemoId(demoId);
  const bgGrant = Number(process.env.DEMO_BG_CREDITS ?? "3");
  const sceneGrant = Number(process.env.DEMO_SCENE_CREDITS ?? "3");

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { bgCreditsRemaining: bgGrant, sceneCredits: sceneGrant },
  });

  await prisma.creditEvent.create({
    data: {
      userId: user.id,
      type: "dev_refill",
      delta: bgGrant - user.bgCreditsRemaining,
      balance: bgGrant,
      note: "Geliştirme / demo kredi yenileme",
    },
  });

  return NextResponse.json({
    bgCreditsRemaining: updated.bgCreditsRemaining,
    sceneCredits: updated.sceneCredits,
    message: `${bgGrant} arka plan + ${sceneGrant} sahne kredisi yüklendi.`,
  });
}
