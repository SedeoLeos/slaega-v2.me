import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { aboutPageRepository } from "@/features/about/repositories/about-page.repository";

export async function GET() {
  const data = await aboutPageRepository.getOrCreate();
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ message: "ID manquant" }, { status: 400 });

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ message: "Body invalide" }, { status: 400 });

  const updated = await aboutPageRepository.update(id, body);
  if (!updated) return NextResponse.json({ message: "Introuvable" }, { status: 404 });

  return NextResponse.json(updated);
}
