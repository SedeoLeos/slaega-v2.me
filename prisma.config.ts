// Prisma 7 config — replaces the legacy "prisma" key in package.json.
// Docs: https://www.prisma.io/docs/orm/prisma-schema/overview/locations#prismaconfigts
//
// Provider resolution order (same as scripts/db.ts):
//   1. DATABASE_PROVIDER env var  → set in Vercel dashboard or .env
//   2. DATABASE_URL prefix        → postgres:// / mysql:// / file:
//   3. Default: sqlite
import path from "node:path";
import { defineConfig } from "prisma/config";
import { config as loadEnv } from "dotenv";

// Load .env so DATABASE_URL / DATABASE_PROVIDER are available.
loadEnv();

type Provider = "sqlite" | "postgresql" | "mysql";

function resolveProvider(): Provider {
  const VALID: Provider[] = ["sqlite", "postgresql", "mysql"];

  // 1. Explicit env var (Vercel dashboard or .env)
  const fromEnv = process.env.DATABASE_PROVIDER?.trim().toLowerCase() as Provider | undefined;
  if (fromEnv && VALID.includes(fromEnv)) return fromEnv;

  // 2. Auto-detect from DATABASE_URL prefix
  const url = (process.env.DATABASE_URL ?? "").trim().toLowerCase();
  if (url.startsWith("postgres://") || url.startsWith("postgresql://")) return "postgresql";
  if (url.startsWith("mysql://") || url.startsWith("mariadb://")) return "mysql";

  // 3. Default to sqlite (local dev without explicit config)
  return "sqlite";
}

const provider = resolveProvider();

// `prisma migrate` / `prisma db push` need a real (non-pooled) connection.
// Supabase: DATABASE_URL is the pgbouncer pooler (cannot run DDL), so we
// fall back to DIRECT_URL when it's set. For SQLite/MySQL or plain Postgres
// without a pooler, just keep DATABASE_URL.
const migrateUrl = process.env.DIRECT_URL?.trim()
  ? process.env.DIRECT_URL
  : process.env.DATABASE_URL;

export default defineConfig({
  // Active provider's schema folder (datasource + generator + models).
  schema: path.join("prisma", provider, "schema"),

  // Used by `prisma migrate` / `prisma db push` to talk to the actual DB.
  // (At runtime the app uses driver adapters — see src/lib/db.ts —
  // which always read DATABASE_URL, i.e. the pooled URL on Supabase.)
  datasource: {
    url: migrateUrl,
  },

  migrations: {
    // Each provider keeps its own migration history; SQL is dialect-specific.
    path: path.join("prisma", provider, "migrations"),
    seed: "tsx prisma/seed.ts",
  },
});
