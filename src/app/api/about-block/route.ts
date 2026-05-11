import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { aboutBlockRepository } from "@/features/banner/repositories/banner.repository";

export async function GET() {
  const list = await aboutBlockRepository.getAll();
  return NextResponse.json(list);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ message: "Body invalide" }, { status: 400 });
  const created = await aboutBlockRepository.create(body);
  return NextResponse.json(created);
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ message: "ID manquant" }, { status: 400 });
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ message: "Body invalide" }, { status: 400 });
  const updated = await aboutBlockRepository.update(id, body);
  if (!updated) return NextResponse.json({ message: "Introuvable" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ message: "ID manquant" }, { status: 400 });
  const ok = await aboutBlockRepository.delete(id);
  return NextResponse.json({ ok });
}
