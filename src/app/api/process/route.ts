import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { processRepository } from "@/features/process/repositories/process.repository";

export async function GET(req: NextRequest) {
  const admin = req.nextUrl.searchParams.get("admin") === "1";
  if (admin) {
    const session = await auth();
    if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
    return NextResponse.json(await processRepository.getAll());
  }
  return NextResponse.json(await processRepository.getPublished());
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ message: "Body invalide" }, { status: 400 });
  const created = await processRepository.create(body);
  return NextResponse.json(created);
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ message: "ID manquant" }, { status: 400 });
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ message: "Body invalide" }, { status: 400 });
  const updated = await processRepository.update(id, body);
  if (!updated) return NextResponse.json({ message: "Introuvable" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ message: "ID manquant" }, { status: 400 });
  const ok = await processRepository.delete(id);
  if (!ok) return NextResponse.json({ message: "Introuvable" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
