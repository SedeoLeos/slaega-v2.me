// Prisma 7 config — replaces the legacy "prisma" key in package.json.
// Docs: https://www.prisma.io/docs/orm/prisma-schema/overview/locations#prismaconfigts
//
// Provider-aware: reads `prisma/.active-provider` and resolves the schema
// and migrations paths to the matching provider directory. Run
// `pnpm db:use <sqlite|postgresql|mysql>` to switch.
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { defineConfig } from "prisma/config";
import { config as loadEnv } from "dotenv";

// Load .env so DATABASE_URL is available to the migrate engine.
loadEnv();

type Provider = "sqlite" | "postgresql" | "mysql";

function readActiveProvider(): Provider {
  const file = path.join("prisma", ".active-provider");
  if (!existsSync(file)) return "sqlite";
  const value = readFileSync(file, "utf8").trim();
  if (value === "postgresql" || value === "mysql" || value === "sqlite") return value;
  return "sqlite";
}

const provider = readActiveProvider();

export default defineConfig({
  // Active provider's schema folder (datasource + generator + models).
  schema: path.join("prisma", provider, "schema"),

  // Used by `prisma migrate` / `prisma db push` to talk to the actual DB.
  // (At runtime the app uses driver adapters — see src/lib/db.ts.)
  datasource: {
    url: process.env.DATABASE_URL,
  },

  migrations: {
    // Each provider keeps its own migration history; SQL is dialect-specific.
    path: path.join("prisma", provider, "migrations"),
    seed: "tsx prisma/seed.ts",
  },
});
