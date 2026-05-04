import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { contactFieldRepository } from "@/features/contact-fields/repositories/contact-field.repository";

export async function GET(req: NextRequest) {
  const admin = req.nextUrl.searchParams.get("admin") === "1";
  if (admin) {
    const session = await auth();
    if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
    return NextResponse.json(await contactFieldRepository.getAll());
  }
  return NextResponse.json(await contactFieldRepository.getPublished());
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ message: "Body invalide" }, { status: 400 });
  try {
    const created = await contactFieldRepository.create(body);
    return NextResponse.json(created);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Erreur";
    return NextResponse.json({ message: msg }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ message: "ID manquant" }, { status: 400 });
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ message: "Body invalide" }, { status: 400 });
  const updated = await contactFieldRepository.update(id, body);
  if (!updated) return NextResponse.json({ message: "Introuvable" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ message: "ID manquant" }, { status: 400 });
  const ok = await contactFieldRepository.delete(id);
  return NextResponse.json({ ok });
}
