import { auth } from "@/auth";
import { siteConfigRepository } from "@/features/site-config/repositories/site-config.repository";
import { NextRequest, NextResponse } from "next/server";

/** GET /api/site-config — returns current portfolio theme (public read) */
export async function GET() {
  const theme = await siteConfigRepository.getTheme();
  return NextResponse.json({ theme });
}

/** PUT /api/site-config — update theme (admin only) */
export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  }

  const body = await req.json();
  const theme = await siteConfigRepository.setTheme(body.theme ?? body);

  return NextResponse.json({ ok: true, theme });
}
