import { auth } from "@/auth";
import { siteConfigRepository } from "@/features/site-config/repositories/site-config.repository";
import { NextRequest, NextResponse } from "next/server";

/** GET /api/site-config — returns theme + ticker (public read) */
export async function GET() {
  const [theme, ticker] = await Promise.all([
    siteConfigRepository.getTheme(),
    siteConfigRepository.getTicker(),
  ]);
  return NextResponse.json({ theme, ticker });
}

/** PUT /api/site-config — update theme and/or ticker (admin only) */
export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  }

  const body = await req.json();
  const [theme, ticker] = await Promise.all([
    body.theme  ? siteConfigRepository.setTheme(body.theme)   : siteConfigRepository.getTheme(),
    body.ticker ? siteConfigRepository.setTicker(body.ticker) : siteConfigRepository.getTicker(),
  ]);

  return NextResponse.json({ ok: true, theme, ticker });
}
