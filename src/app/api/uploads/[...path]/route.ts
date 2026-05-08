import { NextRequest, NextResponse } from "next/server";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".avif": "image/avif",
};

/**
 * Build the *real* upstream URL for a given filename when using S3.
 *
 * Supabase : https://<ref>.supabase.co/storage/v1/s3  →
 *            https://<ref>.supabase.co/storage/v1/object/public/<bucket>/<file>
 *
 * Others (R2, MinIO, …) :
 *            <endpoint>/<bucket>/<file>
 */
function remoteUrlFor(filename: string): string | null {
  const provider = (process.env.STORAGE_PROVIDER ?? "local").toLowerCase();
  if (provider !== "s3" && provider !== "r2" && provider !== "minio") return null;

  const bucket   = process.env.STORAGE_BUCKET;
  const endpoint = process.env.STORAGE_ENDPOINT;
  if (!bucket || !endpoint) return null;

  if (endpoint.includes("supabase.co")) {
    // Strip /s3 suffix → use the public object path instead
    const base = endpoint.replace(/\/s3\/?$/, "");
    return `${base}/object/public/${bucket}/${filename}`;
  }

  return `${endpoint.replace(/\/$/, "")}/${bucket}/${filename}`;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: pathSegments } = await params;
  const relativePath = pathSegments.join("/");

  // Security: block directory traversal
  if (relativePath.includes("..") || relativePath.startsWith("/")) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  // ── S3 / Supabase mode — proxy transparently ─────────────────────────────
  const upstream = remoteUrlFor(relativePath);
  if (upstream) {
    try {
      const res = await fetch(upstream);
      if (!res.ok) return new NextResponse("Not found", { status: 404 });

      const contentType =
        res.headers.get("Content-Type") ?? "application/octet-stream";

      const isVideo = contentType.startsWith("video/");

      if (isVideo) {
        // Stream video — don't buffer the whole file in memory
        return new NextResponse(res.body, {
          headers: {
            "Content-Type":   contentType,
            "Cache-Control":  "public, max-age=31536000, immutable",
            "Accept-Ranges":  "bytes",
            ...(res.headers.get("Content-Length")
              ? { "Content-Length": res.headers.get("Content-Length")! }
              : {}),
          },
        });
      }

      // Images — buffer OK (small files)
      const buffer = await res.arrayBuffer();
      return new NextResponse(new Uint8Array(buffer), {
        headers: {
          "Content-Type":  contentType,
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    } catch {
      return new NextResponse("Error fetching file", { status: 500 });
    }
  }

  // ── Local filesystem mode ─────────────────────────────────────────────────
  const filePath = path.join(UPLOADS_DIR, relativePath);

  if (!filePath.startsWith(UPLOADS_DIR)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  if (!existsSync(filePath)) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const buffer      = await readFile(filePath);
    const ext         = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] ?? "application/octet-stream";

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type":  contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Error reading file", { status: 500 });
  }
}
