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

export async function consumeSceneCredits(userId: string, amount = 1) {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
  if (user.sceneCredits < amount) {
    throw new Error("SCENE_CREDITS_EXHAUSTED");
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { sceneCredits: { decrement: amount } },
  });

  await prisma.creditEvent.create({
    data: {
      userId,
      type: "scene_generate",
      delta: -amount,
      balance: updated.sceneCredits,
      note: amount > 1 ? `Sahne üretimi (${amount} kredi)` : "Sahne üretimi",
    },
  });

  return updated;
}

/** @deprecated use consumeSceneCredits */
export async function consumeSceneCredit(userId: string) {
  return consumeSceneCredits(userId, 1);
}
