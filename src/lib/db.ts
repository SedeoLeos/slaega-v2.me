// Prisma client singleton — safe for Next.js hot-reload.
// Driver-adapter based (Prisma 7) — auto-selects SQLite/Postgres/MySQL
// from DATABASE_URL. See `db-adapter.ts` for switching instructions.
import { PrismaClient } from "@/generated/prisma/client";
import { buildAdapter } from "./db-adapter";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function makeClient(): PrismaClient {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("[db] DATABASE_URL is not set in the environment.");
  }
  return new PrismaClient({
    adapter: buildAdapter(url),
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const db: PrismaClient = globalForPrisma.prisma ?? makeClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
