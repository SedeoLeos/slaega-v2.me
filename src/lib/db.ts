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

function getClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = makeClient();
  }
  return globalForPrisma.prisma;
}

// Lazy proxy: the real PrismaClient (and its DATABASE_URL requirement) is only
// resolved on first actual property access — i.e. the first query — NOT at
// import time. This lets `next build` collect page data for API routes without
// a DATABASE_URL (e.g. Vercel preview deploys); the error is raised only if a
// query genuinely runs without a database configured.
export const db: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    const client = getClient();
    const value = Reflect.get(client as object, prop, receiver);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
