/**
 * Public CV gallery API (no auth). Lists CVs the owner flagged `isPublic`
 * from the SiteConfig `generated-cv:` store. Pass ?id= to fetch one in full
 * (data payload) so the public /cv page can render it with the default design.
 */
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PREFIX = "generated-cv:";

type SavedCv = {
  id: string;
  title: string;
  jobOffer: string;
  language: string;
  data: unknown;
  createdAt: string;
  isPublic?: boolean;
  domain?: string;
};

function parse(value: string): SavedCv | null {
  try {
    return JSON.parse(value) as SavedCv;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");

  if (id) {
    const row = await db.siteConfig.findUnique({ where: { key: PREFIX + id } });
    const cv = row ? parse(row.value) : null;
    if (!cv || !cv.isPublic) return NextResponse.json({ message: "Introuvable" }, { status: 404 });
    return NextResponse.json({ cv });
  }

  const rows = await db.siteConfig.findMany({ where: { key: { startsWith: PREFIX } } });
  const items = rows
    .map((r) => parse(r.value))
    .filter((v): v is SavedCv => v !== null && v.isPublic === true)
    .map(({ data: _data, jobOffer: _jo, ...rest }) => rest) // summaries only
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return NextResponse.json({ items });
}
