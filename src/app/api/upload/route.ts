import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomBytes } from "crypto";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml", "image/avif"];
const MAX_SIZE = 8 * 1024 * 1024; // 8 MB

function sanitize(name: string) {
  return name
    .toLowerCase()
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "image";
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  }

  const formData = await req.formData().catch(() => null);
  if (!formData) {
    return NextResponse.json({ message: "Form data invalide" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ message: "Aucun fichier" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { message: `Type non supporté. Utilise : ${ALLOWED_TYPES.map((t) => t.replace("image/", "")).join(", ")}` },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { message: `Fichier trop lourd (max ${MAX_SIZE / 1024 / 1024} MB)` },
      { status: 400 }
    );
  }

  // Build a unique filename
  const ext = file.name.includes(".") ? file.name.split(".").pop()!.toLowerCase() : "png";
  const safeBase = sanitize(file.name);
  const stamp = Date.now();
  const rand = randomBytes(3).toString("hex");
  const filename = `${stamp}-${rand}-${safeBase}.${ext}`;

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });
  const filepath = path.join(uploadDir, filename);

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filepath, buffer);

  const url = `/uploads/${filename}`;
  return NextResponse.json({
    url,
    filename,
    size: file.size,
    type: file.type,
  });
}
