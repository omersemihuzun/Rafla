import { prisma } from "./prisma";

export async function consumeBgCredit(userId: string) {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
  if (user.bgCreditsRemaining <= 0) {
    throw new Error("BG_CREDITS_EXHAUSTED");
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { bgCreditsRemaining: { decrement: 1 } },
  });

  await prisma.creditEvent.create({
    data: {
      userId,
      type: "bg_remove",
      delta: -1,
      balance: updated.bgCreditsRemaining,
      note: "Arka plan kaldırma",
    },
  });

  return updated;
}

export async function consumeSceneCredit(userId: string) {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
  if (user.sceneCredits <= 0) {
    throw new Error("SCENE_CREDITS_EXHAUSTED");
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { sceneCredits: { decrement: 1 } },
  });

  await prisma.creditEvent.create({
    data: {
      userId,
      type: "scene_generate",
      delta: -1,
      balance: updated.sceneCredits,
      note: "Sahne üretimi",
    },
  });

  return updated;
}
