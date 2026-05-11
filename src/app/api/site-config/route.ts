import { auth } from "@/auth";
import { siteConfigRepository } from "@/features/site-config/repositories/site-config.repository";
import { revalidateEverything } from "@/lib/revalidation";
import { NextRequest, NextResponse } from "next/server";

/** GET /api/site-config — returns theme + ticker + terminal + value-cards (public read) */
export async function GET() {
  const [theme, ticker, terminal, valueCards] = await Promise.all([
    siteConfigRepository.getTheme(),
    siteConfigRepository.getTicker(),
    siteConfigRepository.getTerminal(),
    siteConfigRepository.getValueCards(),
  ]);
  return NextResponse.json({ theme, ticker, terminal, valueCards });
}

/** PUT /api/site-config — update any config key (admin only) */
export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  }

  const body = await req.json();
  const [theme, ticker, terminal, valueCards] = await Promise.all([
    body.theme          ? siteConfigRepository.setTheme(body.theme)             : siteConfigRepository.getTheme(),
    body.ticker         ? siteConfigRepository.setTicker(body.ticker)           : siteConfigRepository.getTicker(),
    body.terminal       ? siteConfigRepository.setTerminal(body.terminal)       : siteConfigRepository.getTerminal(),
    body["value-cards"] ? siteConfigRepository.setValueCards(body["value-cards"]) : siteConfigRepository.getValueCards(),
  ]);

  revalidateEverything();
  return NextResponse.json({ ok: true, theme, ticker, terminal, valueCards });
}
