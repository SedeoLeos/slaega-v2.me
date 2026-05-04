import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { readdir, stat, unlink } from "fs/promises";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  }

  try {
    const files = await readdir(UPLOAD_DIR);
    const items = await Promise.all(
      files
        .filter((f) => !f.startsWith(".") && /\.(jpe?g|png|webp|gif|svg|avif)$/i.test(f))
        .map(async (filename) => {
          const filepath = path.join(UPLOAD_DIR, filename);
          const s = await stat(filepath);
          return {
            filename,
            url: `/uploads/${filename}`,
            size: s.size,
            createdAt: s.birthtimeMs || s.mtimeMs,
          };
        })
    );
    items.sort((a, b) => b.createdAt - a.createdAt);
    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ items: [] });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  }

  const filename = req.nextUrl.searchParams.get("filename");
  if (!filename || filename.includes("/") || filename.includes("..")) {
    return NextResponse.json({ message: "Nom de fichier invalide" }, { status: 400 });
  }

  try {
    await unlink(path.join(UPLOAD_DIR, filename));
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ message: "Fichier introuvable" }, { status: 404 });
  }
}
