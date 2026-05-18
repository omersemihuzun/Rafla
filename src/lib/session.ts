import { cookies } from "next/headers";
import { prisma } from "./prisma";

export const DEMO_COOKIE = "rafla_demo_id";

export async function getDemoIdFromCookie(): Promise<string | null> {
  const jar = await cookies();
  return jar.get(DEMO_COOKIE)?.value ?? null;
}

export async function getUserByDemoId(demoId: string) {
  return prisma.user.findUnique({ where: { demoId } });
}

export async function createDemoUser(demoId: string) {
  const user = await prisma.user.create({
    data: { demoId, bgCreditsRemaining: 3, sceneCredits: 0 },
  });
  await prisma.creditEvent.create({
    data: {
      userId: user.id,
      type: "signup",
      delta: 3,
      balance: 3,
      note: "Ücretsiz arka plan hakkı",
    },
  });
  return user;
}

export async function getOrCreateUserByDemoId(demoId: string) {
  const existing = await getUserByDemoId(demoId);
  if (existing) return existing;
  return createDemoUser(demoId);
}
