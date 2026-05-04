import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getStorage } from "@/lib/storage";
import { randomBytes } from "crypto";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "image/avif",
];
const MAX_SIZE = 8 * 1024 * 1024; // 8 MB

function sanitize(name: string) {
  return (
    name
      .toLowerCase()
      .replace(/\.[^.]+$/, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "image"
  );
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
      {
        message: `Type non supporté. Utilise : ${ALLOWED_TYPES.map((t) =>
          t.replace("image/", "")
        ).join(", ")}`,
      },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { message: `Fichier trop lourd (max ${MAX_SIZE / 1024 / 1024} MB)` },
      { status: 400 }
    );
  }

  // Build a unique, URL-safe filename
  const ext = file.name.includes(".") ? file.name.split(".").pop()!.toLowerCase() : "png";
  const safeBase = sanitize(file.name);
  const stamp = Date.now();
  const rand = randomBytes(3).toString("hex");
  const filename = `${stamp}-${rand}-${safeBase}.${ext}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const storage = getStorage();
    const { url } = await storage.put(filename, buffer, file.type);

    return NextResponse.json({
      url,
      filename,
      size: file.size,
      type: file.type,
      provider: storage.provider,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Erreur d'upload";
    return NextResponse.json({ message }, { status: 500 });
  }
}
