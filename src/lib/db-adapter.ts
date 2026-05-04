/**
 * Driver adapter factory — picks the right Prisma 7 adapter from DATABASE_URL.
 *
 *   • file:…                       → SQLite      (better-sqlite3)
 *   • postgres:// / postgresql://  → PostgreSQL  (pg) — Supabase, Neon, Vercel Postgres
 *   • mysql:// / mariadb://        → MySQL       (mariadb)
 *
 * To switch DB:
 *   1. Run `pnpm db:use sqlite | postgresql | mysql`
 *      → writes prisma/.active-provider, syncs prisma/_shared/models.prisma
 *        into prisma/<provider>/schema/, regenerates the client
 *   2. Update DATABASE_URL in .env accordingly
 *   3. Run `pnpm db:migrate` to create + apply migrations for that provider
 *      (each provider has its own migrations dir at prisma/<provider>/migrations)
 */
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

export type DbProvider = "sqlite" | "postgresql" | "mysql";

export function detectProvider(url: string): DbProvider {
  const u = url.trim().toLowerCase();
  if (u.startsWith("file:") || u.startsWith("sqlite:")) return "sqlite";
  if (u.startsWith("postgres://") || u.startsWith("postgresql://")) return "postgresql";
  if (u.startsWith("mysql://") || u.startsWith("mariadb://")) return "mysql";
  throw new Error(
    `[db-adapter] Cannot detect provider from DATABASE_URL prefix.
     Supported prefixes: file:, postgres://, postgresql://, mysql://, mariadb://`
  );
}

/**
 * Build a Prisma driver-adapter factory for the given URL.
 * Returns a sync factory (not a Promise) so it can be passed directly
 * to `new PrismaClient({ adapter })`.
 */
export function buildAdapter(url: string) {
  const provider = detectProvider(url);

  switch (provider) {
    case "sqlite": {
      // SQLite expects a plain file path, not the "file:" prefix.
      const filePath = url.replace(/^file:/, "").replace(/^sqlite:/, "");
      return new PrismaBetterSqlite3({ url: filePath });
    }
    case "postgresql":
      return new PrismaPg(url);
    case "mysql":
      return new PrismaMariaDb(url);
  }
}
