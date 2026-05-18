import { NextRequest, NextResponse } from "next/server";
import { getDemoIdFromCookie, getOrCreateUserByDemoId } from "@/lib/session";
import { saveUpload } from "@/lib/storage";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const demoId = await getDemoIdFromCookie();
  if (!demoId) {
    return NextResponse.json({ error: "NO_SESSION" }, { status: 401 });
  }

  const user = await getOrCreateUserByDemoId(demoId);
  const form = await req.formData();
  const file = form.get("file");

  if (!file || !(file instanceof Blob)) {
    return NextResponse.json({ error: "NO_FILE" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const name = file instanceof File ? file.name : "upload.jpg";
  const path = await saveUpload(buffer, name);

  const listing = await prisma.listing.create({
    data: {
      userId: user.id,
      originalImagePath: path,
      platform: (form.get("platform") as string) ?? "dolap",
    },
  });

  return NextResponse.json({ listingId: listing.id, imagePath: path });
}
