#!/usr/bin/env tsx
/**
 * Prisma command wrapper — auto-applies `--schema` based on the active provider.
 *
 * The active provider is stored in `prisma/.active-provider` (one of
 * `sqlite | postgresql | mysql`). Run `pnpm db:use <provider>` to switch.
 *
 * Each provider has its own schema dir AND its own migrations history:
 *
 *   prisma/sqlite/schema/        prisma/sqlite/migrations/
 *   prisma/postgresql/schema/    prisma/postgresql/migrations/
 *   prisma/mysql/schema/         prisma/mysql/migrations/
 *
 * This avoids the cross-dialect migration mess: migrations generated for
 * SQLite (e.g. INTEGER PRIMARY KEY AUTOINCREMENT) cannot be replayed on
 * Postgres or MySQL, so each provider keeps a separate history.
 *
 * The canonical model definitions live in `prisma/_shared/models.prisma`
 * and are mirrored into each provider's schema folder by `db-use`.
 *
 * Usage:
 *   tsx scripts/db.ts generate
 *   tsx scripts/db.ts migrate dev --name init
 *   tsx scripts/db.ts migrate deploy
 *   tsx scripts/db.ts studio
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

type Provider = "sqlite" | "postgresql" | "mysql";

function readActiveProvider(): Provider {
  const file = path.join(process.cwd(), "prisma", ".active-provider");
  if (!existsSync(file)) return "sqlite";
  const value = readFileSync(file, "utf8").trim() as Provider;
  if (value !== "sqlite" && value !== "postgresql" && value !== "mysql") {
    console.error(`✗ Invalid value in prisma/.active-provider: "${value}"`);
    process.exit(1);
  }
  return value;
}

function main() {
  const provider = readActiveProvider();
  const schemaDir = path.join("prisma", provider, "schema");
  const abs = path.join(process.cwd(), schemaDir);

  if (!existsSync(abs)) {
    console.error(`✗ Schema directory missing: ${schemaDir}`);
    console.error(`  Run \`pnpm db:use ${provider}\` to (re)create it.`);
    process.exit(1);
  }

  const userArgs = process.argv.slice(2);
  if (userArgs.length === 0) {
    console.error("Usage: tsx scripts/db.ts <prisma-command> [...flags]");
    process.exit(1);
  }

  // Append --schema only if the user hasn't already passed one.
  const hasSchema = userArgs.some((a) => a === "--schema" || a.startsWith("--schema="));
  const args = ["prisma", ...userArgs];
  if (!hasSchema) args.push("--schema", schemaDir);

  // Show what's running for transparency.
  console.log(`▶ ${args.join(" ")}    (provider=${provider})`);

  const result = spawnSync("pnpm", args, { stdio: "inherit" });
  process.exit(result.status ?? 1);
}

main();
