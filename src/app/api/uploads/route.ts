import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getStorage } from "@/lib/storage";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  }

  try {
    const items = await getStorage().list();
    return NextResponse.json({ items });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Erreur";
    return NextResponse.json({ message, items: [] }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  }

  const filename = req.nextUrl.searchParams.get("filename");
  if (!filename || filename.includes("..")) {
    return NextResponse.json({ message: "Nom de fichier invalide" }, { status: 400 });
  }

  const ok = await getStorage().remove(filename);
  if (!ok) {
    return NextResponse.json({ message: "Fichier introuvable" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
