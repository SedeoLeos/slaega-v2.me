/**
 * Storage abstraction — switch between local filesystem and S3-compatible
 * object storage (AWS S3, Cloudflare R2, MinIO, Backblaze B2, …).
 *
 * Driver is picked from env:
 *   STORAGE_PROVIDER=local                     → public/uploads/ (default)
 *   STORAGE_PROVIDER=s3                        → AWS S3 / R2 / MinIO / etc.
 *
 * Required env vars (when STORAGE_PROVIDER=s3):
 *   STORAGE_BUCKET            bucket name
 *   STORAGE_REGION            "auto" for R2, "us-east-1" / "eu-west-1" for AWS, etc.
 *   STORAGE_ACCESS_KEY_ID
 *   STORAGE_SECRET_ACCESS_KEY
 *   STORAGE_ENDPOINT          (optional) custom endpoint URL — required for R2/MinIO
 *                             e.g. https://<account>.r2.cloudflarestorage.com
 *                                  http://localhost:9000 (MinIO)
 *   STORAGE_PUBLIC_URL        (optional) public CDN/base URL prefix — if your bucket
 *                             is served behind a custom domain or CDN
 *                             e.g. https://cdn.slaega.me
 *                             If not set, falls back to {endpoint}/{bucket}/{key}
 *   STORAGE_FORCE_PATH_STYLE  "true" for MinIO/local-S3 setups (default false for AWS/R2)
 */

import {
    DeleteObjectCommand,
    ListObjectsV2Command,
    PutObjectCommand,
    S3Client,
} from "@aws-sdk/client-s3";
import { NodeHttpHandler } from "@smithy/node-http-handler";
import https from "node:https";
import { mkdir, readdir, stat, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

export type StorageProvider = "local" | "s3";

export type StoredItem = {
  filename: string;
  url: string;
  size: number;
  createdAt: number;
};

export type StorageDriver = {
  provider: StorageProvider;
  put: (filename: string, buffer: Buffer, contentType: string) => Promise<{ url: string }>;
  list: () => Promise<StoredItem[]>;
  remove: (filename: string) => Promise<boolean>;
};

// ─────────────────────────────────────────────────────────────────────
// Local filesystem driver
// ─────────────────────────────────────────────────────────────────────

const LOCAL_DIR = path.join(process.cwd(), "public", "uploads");

const localDriver: StorageDriver = {
  provider: "local",

  async put(filename, buffer) {
    await mkdir(LOCAL_DIR, { recursive: true });
    await writeFile(path.join(LOCAL_DIR, filename), buffer);
    // Serve via API route for immediate availability (no rebuild needed)
    return { url: `/api/uploads/${filename}` };
  },

  async list() {
    try {
      const files = await readdir(LOCAL_DIR);
      const items = await Promise.all(
        files
          .filter((f) => !f.startsWith(".") && /\.(jpe?g|png|webp|gif|svg|avif)$/i.test(f))
          .map(async (filename) => {
            const s = await stat(path.join(LOCAL_DIR, filename));
            return {
              filename,
              url: `/api/uploads/${filename}`,
              size: s.size,
              createdAt: s.birthtimeMs || s.mtimeMs,
            };
          })
      );
      items.sort((a, b) => b.createdAt - a.createdAt);
      return items;
    } catch {
      return [];
    }
  },

  async remove(filename) {
    try {
      await unlink(path.join(LOCAL_DIR, filename));
      return true;
    } catch {
      return false;
    }
  },
};

// ─────────────────────────────────────────────────────────────────────
// S3-compatible driver (AWS S3, Cloudflare R2, MinIO, B2, …)
// ─────────────────────────────────────────────────────────────────────

let cachedS3Client: S3Client | null = null;

/** Supabase S3 endpoint URLs contain "supabase.co/storage/v1/s3" */
function isSupabaseEndpoint(endpoint?: string): boolean {
  return !!endpoint?.includes("supabase.co");
}

function s3Client(): S3Client {
  if (cachedS3Client) return cachedS3Client;

  const region = process.env.STORAGE_REGION ?? "auto";
  const endpoint = process.env.STORAGE_ENDPOINT;
  const accessKeyId = process.env.STORAGE_ACCESS_KEY_ID;
  const secretAccessKey = process.env.STORAGE_SECRET_ACCESS_KEY;
  // Supabase requires path-style URLs — force it automatically
  const forcePathStyle =
    process.env.STORAGE_FORCE_PATH_STYLE === "true" ||
    isSupabaseEndpoint(endpoint);

  if (!accessKeyId || !secretAccessKey) {
    throw new Error(
      "[storage] S3 credentials missing. Set STORAGE_ACCESS_KEY_ID + STORAGE_SECRET_ACCESS_KEY."
    );
  }

  // Custom HTTPS agent — fixes TLS handshake failure on Node 17+/OpenSSL 3
  // (observed with Supabase S3-compatible storage).
  const httpsAgent = new https.Agent({
    rejectUnauthorized: true,
    minVersion: "TLSv1.2",
  });

  cachedS3Client = new S3Client({
    region,
    endpoint,
    forcePathStyle,
    credentials: { accessKeyId, secretAccessKey },
    requestHandler: new NodeHttpHandler({ httpsAgent }),
  });

  return cachedS3Client;
}

function publicUrlFor(filename: string): string {
  const customBase = process.env.STORAGE_PUBLIC_URL;
  if (customBase) return `${customBase.replace(/\/$/, "")}/${filename}`;

  const endpoint = process.env.STORAGE_ENDPOINT;
  const bucket = process.env.STORAGE_BUCKET!;
  if (endpoint) {
    // path-style URL (MinIO, R2 default)
    return `${endpoint.replace(/\/$/, "")}/${bucket}/${filename}`;
  }
  // AWS S3 virtual-hosted style
  const region = process.env.STORAGE_REGION ?? "us-east-1";
  return `https://${bucket}.s3.${region}.amazonaws.com/${filename}`;
}

const s3Driver: StorageDriver = {
  provider: "s3",

  async put(filename, buffer, contentType) {
    const bucket = process.env.STORAGE_BUCKET;
    if (!bucket) throw new Error("[storage] STORAGE_BUCKET not set.");

    await s3Client().send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: filename,
        Body: buffer,
        ContentType: contentType,
        // ACL uniquement pour AWS S3 natif — Supabase / R2 / MinIO ne le supportent pas.
        // Active avec STORAGE_USE_ACL=true si tu es sur AWS S3 pur.
        ...(process.env.STORAGE_USE_ACL === "true" && { ACL: "public-read" }),
      })
    );

    return { url: publicUrlFor(filename) };
  },

  async list() {
    const bucket = process.env.STORAGE_BUCKET;
    if (!bucket) return [];

    const res = await s3Client().send(
      new ListObjectsV2Command({ Bucket: bucket, MaxKeys: 1000 })
    );

    const items: StoredItem[] = (res.Contents ?? [])
      .filter((o) => o.Key && /\.(jpe?g|png|webp|gif|svg|avif)$/i.test(o.Key))
      .map((o) => ({
        filename: o.Key!,
        url: publicUrlFor(o.Key!),
        size: o.Size ?? 0,
        createdAt: o.LastModified ? o.LastModified.getTime() : Date.now(),
      }));

    items.sort((a, b) => b.createdAt - a.createdAt);
    return items;
  },

  async remove(filename) {
    const bucket = process.env.STORAGE_BUCKET;
    if (!bucket) return false;
    try {
      await s3Client().send(
        new DeleteObjectCommand({ Bucket: bucket, Key: filename })
      );
      return true;
    } catch {
      return false;
    }
  },
};

// ─────────────────────────────────────────────────────────────────────
// Driver picker
// ─────────────────────────────────────────────────────────────────────

export function getStorage(): StorageDriver {
  const provider = (process.env.STORAGE_PROVIDER ?? "local").toLowerCase();
  if (provider === "s3" || provider === "r2" || provider === "minio") {
    return s3Driver;
  }
  return localDriver;
}
