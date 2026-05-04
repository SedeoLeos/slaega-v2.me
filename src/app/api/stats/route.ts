import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { statRepository } from "@/features/banner/repositories/banner.repository";

export async function GET(req: NextRequest) {
  const admin = req.nextUrl.searchParams.get("admin") === "1";
  if (admin) {
    const session = await auth();
    if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
    return NextResponse.json(await statRepository.getAll());
  }
  return NextResponse.json(await statRepository.getPublished());
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ message: "Body invalide" }, { status: 400 });
  const created = await statRepository.create(body);
  return NextResponse.json(created);
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ message: "ID manquant" }, { status: 400 });
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ message: "Body invalide" }, { status: 400 });
  const updated = await statRepository.update(id, body);
  if (!updated) return NextResponse.json({ message: "Introuvable" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ message: "ID manquant" }, { status: 400 });
  const ok = await statRepository.delete(id);
  return NextResponse.json({ ok });
}
