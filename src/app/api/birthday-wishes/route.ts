/**
 * Birthday wishes — visitors leave a wish/thanks on the /birthday page.
 * Stored in the existing SiteConfig key-value table under `birthday-wish:`
 * (no migration needed, works across sqlite/postgres/mysql).
 */
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PREFIX = "birthday-wish:";

type Wish = {
  id: string;
  name: string;
  message: string;
  createdAt: string;
};

function parse(value: string): Wish | null {
  try {
    return JSON.parse(value) as Wish;
  } catch {
    return null;
  }
}

// GET — public list of wishes, newest first.
export async function GET() {
  const rows = await db.siteConfig.findMany({ where: { key: { startsWith: PREFIX } } });
  const items = rows
    .map((r) => parse(r.value))
    .filter((v): v is Wish => v !== null)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return NextResponse.json({ items, count: items.length });
}

// POST — public: leave a wish { name, message }.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const name = String(body?.name ?? "").trim();
  const message = String(body?.message ?? "").trim();

  if (!message) {
    return NextResponse.json({ message: "Le message est requis" }, { status: 400 });
  }
  if (message.length > 500 || name.length > 60) {
    return NextResponse.json({ message: "Message trop long" }, { status: 400 });
  }

  const record: Wish = {
    id: randomUUID(),
    name: name.slice(0, 60) || "Anonyme",
    message: message.slice(0, 500),
    createdAt: new Date().toISOString(),
  };

  await db.siteConfig.create({ data: { key: PREFIX + record.id, value: JSON.stringify(record) } });
  return NextResponse.json({ ok: true, item: record }, { status: 201 });
}

// DELETE — admin only: remove a wish by ?id= (moderation).
export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ message: "id requis" }, { status: 400 });

  await db.siteConfig.delete({ where: { key: PREFIX + id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
