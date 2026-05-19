#!/usr/bin/env tsx
/**
 * Prisma command wrapper — auto-applies `--schema` based on the active provider.
 *
 * Provider resolution order:
 *   1. DATABASE_PROVIDER env var  (set in .env or Vercel dashboard)
 *   2. DATABASE_URL prefix        (file: → sqlite, postgres:// → postgresql, mysql:// → mysql)
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
import path from "node:path";
import { spawnSync } from "node:child_process";

type Provider = "sqlite" | "postgresql" | "mysql";

function readActiveProvider(): Provider {
  const VALID: Provider[] = ["sqlite", "postgresql", "mysql"];

  // 1. Explicit env var — set in Vercel dashboard or local .env
  const fromEnv = process.env.DATABASE_PROVIDER?.trim().toLowerCase() as Provider | undefined;
  if (fromEnv) {
    if (!VALID.includes(fromEnv)) {
      console.error(
        `✗ DATABASE_PROVIDER="${fromEnv}" is invalid. Expected: sqlite | postgresql | mysql`,
      );
      process.exit(1);
    }
    return fromEnv;
  }

  // 2. Auto-detect from DATABASE_URL prefix
  const url = (process.env.DATABASE_URL ?? "").trim().toLowerCase();
  if (url.startsWith("postgres://") || url.startsWith("postgresql://")) return "postgresql";
  if (url.startsWith("mysql://") || url.startsWith("mariadb://")) return "mysql";
  if (url.startsWith("file:") || url.startsWith("sqlite:") || url === "") return "sqlite";

  console.error(
    `✗ Cannot detect database provider. Set one of:\n` +
    `    DATABASE_PROVIDER=sqlite|postgresql|mysql   (env var — local .env or Vercel dashboard)\n` +
    `    DATABASE_URL with a recognised prefix       (file: / postgres:// / mysql://)`,
  );
  process.exit(1);
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
