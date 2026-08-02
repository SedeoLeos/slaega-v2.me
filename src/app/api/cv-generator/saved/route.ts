/**
 * Saved CVs — persist generated CVs (prompt + data) so they can be reused
 * without calling the AI again. Stored in the existing SiteConfig key-value
 * table under the `generated-cv:` prefix (no migration needed).
 */
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";

export const runtime = "nodejs";

const PREFIX = "generated-cv:";

type SavedCv = {
  id: string;
  title: string;
  jobOffer: string;
  language: string;
  data: unknown;
  createdAt: string;
  /** Published on the public /cv gallery. */
  isPublic?: boolean;
  /** Domain / target label, e.g. "Banque", "Fintech", "Full-stack". */
  domain?: string;
};

async function requireAuth() {
  const session = await auth();
  return !!session;
}

// GET — list saved CVs (newest first). Pass ?id= to fetch one in full.
export async function GET(req: NextRequest) {
  if (!(await requireAuth())) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  const id = req.nextUrl.searchParams.get("id");
  if (id) {
    const row = await db.siteConfig.findUnique({ where: { key: PREFIX + id } });
    if (!row) return NextResponse.json({ message: "Introuvable" }, { status: 404 });
    return NextResponse.json({ cv: JSON.parse(row.value) as SavedCv });
  }

  const rows = await db.siteConfig.findMany({ where: { key: { startsWith: PREFIX } } });
  const items = rows
    .map((r) => {
      try {
        return JSON.parse(r.value) as SavedCv;
      } catch {
        return null;
      }
    })
    .filter((v): v is SavedCv => v !== null)
    // Return light summaries for the list (omit the heavy data payload).
    .map(({ data: _data, ...rest }) => rest)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return NextResponse.json({ items });
}

// PUT — update a saved CV's public flag / domain / title: { id, isPublic?, domain?, title? }
export async function PUT(req: NextRequest) {
  if (!(await requireAuth())) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const id = body?.id;
  if (!id) return NextResponse.json({ message: "id requis" }, { status: 400 });

  const row = await db.siteConfig.findUnique({ where: { key: PREFIX + id } });
  if (!row) return NextResponse.json({ message: "Introuvable" }, { status: 404 });

  let record: SavedCv;
  try {
    record = JSON.parse(row.value) as SavedCv;
  } catch {
    return NextResponse.json({ message: "Donnée corrompue" }, { status: 500 });
  }

  if (typeof body.isPublic === "boolean") record.isPublic = body.isPublic;
  if (typeof body.domain === "string") record.domain = body.domain.slice(0, 60);
  if (typeof body.title === "string" && body.title.trim()) record.title = body.title.slice(0, 160);

  await db.siteConfig.update({ where: { key: PREFIX + id }, data: { value: JSON.stringify(record) } });
  const { data: _d, ...summary } = record;
  return NextResponse.json({ ok: true, item: summary });
}

// POST — save a generated CV: { title, jobOffer, language, data }
export async function POST(req: NextRequest) {
  if (!(await requireAuth())) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body || typeof body.jobOffer !== "string" || body.data == null) {
    return NextResponse.json({ message: "Payload invalide (jobOffer + data requis)" }, { status: 400 });
  }

  const id = randomUUID();
  const record: SavedCv = {
    id,
    title: String(body.title ?? "").slice(0, 160) || "CV sans titre",
    jobOffer: String(body.jobOffer),
    language: body.language === "en" ? "en" : "fr",
    data: body.data,
    createdAt: new Date().toISOString(),
    isPublic: body.isPublic === true,
    domain: typeof body.domain === "string" ? body.domain.slice(0, 60) : "",
  };

  await db.siteConfig.create({ data: { key: PREFIX + id, value: JSON.stringify(record) } });
  return NextResponse.json({ id, title: record.title, createdAt: record.createdAt }, { status: 201 });
}

// DELETE — remove a saved CV by ?id=
export async function DELETE(req: NextRequest) {
  if (!(await requireAuth())) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ message: "id requis" }, { status: 400 });

  await db.siteConfig.delete({ where: { key: PREFIX + id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
