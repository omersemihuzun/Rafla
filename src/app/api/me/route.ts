import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  DEMO_COOKIE,
  getOrCreateUserByDemoId,
  getDemoIdFromCookie,
} from "@/lib/session";

export async function GET() {
  const jar = await cookies();
  let demoId = await getDemoIdFromCookie();

  if (!demoId) {
    demoId = crypto.randomUUID();
    jar.set(DEMO_COOKIE, demoId, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 90,
    });
  }

  const user = await getOrCreateUserByDemoId(demoId);

  return NextResponse.json({
    id: user.id,
    bgCreditsRemaining: user.bgCreditsRemaining,
    sceneCredits: user.sceneCredits,
  });
}
