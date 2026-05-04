// Prisma 7 config — replaces the legacy "prisma" key in package.json.
// Docs: https://www.prisma.io/docs/orm/prisma-schema/overview/locations#prismaconfigts
import path from "node:path";
import { defineConfig } from "prisma/config";
import { config as loadEnv } from "dotenv";

// Load .env so DATABASE_URL is available to the migrate engine.
loadEnv();

export default defineConfig({
  // Multi-file schema folder (provider templates merge with shared models).
  schema: path.join("prisma", "schema"),

  // Used by `prisma migrate` / `prisma db push` to talk to the actual DB.
  // (At runtime the app uses driver adapters — see src/lib/db.ts.)
  datasource: {
    url: process.env.DATABASE_URL,
  },

  migrations: {
    path: path.join("prisma", "migrations"),
    seed: "tsx prisma/seed.ts",
  },
});
