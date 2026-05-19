#!/usr/bin/env tsx
/**
 * Switch the active Prisma datasource provider.
 *
 *   pnpm db:use sqlite           # local file (default)
 *   pnpm db:use postgresql       # Postgres / Supabase / Neon / Vercel Postgres
 *   pnpm db:use mysql            # MySQL / MariaDB / PlanetScale
 *
 * Layout:
 *   prisma/_shared/models.prisma            ← canonical model definitions
 *   prisma/<provider>/schema/               ← per-provider schema (datasource + generator + models)
 *   prisma/<provider>/migrations/           ← per-provider migration history
 *
 * What this command does:
 *   1. Validates the requested provider.
 *   2. Mirrors prisma/_shared/models.prisma → prisma/<provider>/schema/models.prisma
 *      for every provider, so any model edits in `_shared` propagate everywhere.
 *   3. Regenerates the Prisma client against the new active schema.
 *
 * Provider selection (no .active-provider file needed):
 *   - Set DATABASE_PROVIDER=<provider> in .env or Vercel dashboard
 *   - Or just set DATABASE_URL with the right prefix (file: / postgres:// / mysql://)
 *
 * After switching, update DATABASE_URL in .env and run `pnpm db:migrate`.
 */
import { copyFileSync, existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

type Provider = "sqlite" | "postgresql" | "mysql";

const ENV_HINTS: Record<Provider, string[]> = {
  sqlite: [`DATABASE_URL="file:./prisma/dev.db"`],
  postgresql: [
    `DATABASE_URL="postgresql://user:password@host:5432/dbname?schema=public"`,
    `# Supabase pooled (runtime) : postgresql://postgres.[REF]:[PASS]@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true`,
    `DIRECT_URL="postgresql://postgres.[REF]:[PASS]@aws-0-eu-west-1.pooler.supabase.com:5432/postgres"   # Supabase migrations`,
    `# Neon      : postgresql://[user]:[pass]@ep-xxx.neon.tech/dbname?sslmode=require`,
  ],
  mysql: [
    `DATABASE_URL="mysql://user:password@host:3306/dbname"`,
    `# PlanetScale: mysql://[user]:[pass]@aws.connect.psdb.cloud/dbname?sslaccept=strict`,
  ],
};

function isProvider(v: string): v is Provider {
  return v === "sqlite" || v === "postgresql" || v === "mysql";
}

function syncModels(cwd: string, provider: Provider) {
  const src = path.join(cwd, "prisma", "_shared", "models.prisma");
  const dest = path.join(cwd, "prisma", provider, "schema", "models.prisma");
  if (!existsSync(src)) {
    throw new Error(`Canonical models file missing: ${src}`);
  }
  if (!existsSync(path.dirname(dest))) {
    throw new Error(`Provider schema dir missing: ${path.dirname(dest)}`);
  }
  const current = existsSync(dest) ? readFileSync(dest, "utf8") : "";
  const incoming = readFileSync(src, "utf8");
  if (current !== incoming) {
    copyFileSync(src, dest);
    console.log(`  synced models → ${path.relative(cwd, dest)}`);
  }
}

function main() {
  const arg = process.argv[2];
  if (!arg || !isProvider(arg)) {
    console.error(`Usage: pnpm db:use <sqlite|postgresql|mysql>`);
    process.exit(1);
  }
  const provider: Provider = arg;
  const cwd = process.cwd();

  const schemaDir = path.join(cwd, "prisma", provider, "schema");
  if (!existsSync(schemaDir)) {
    console.error(`✗ Provider schema directory missing: ${path.relative(cwd, schemaDir)}`);
    process.exit(1);
  }

  // 1. Sync canonical models into every provider so they stay aligned.
  console.log("Syncing models from prisma/_shared …");
  (["sqlite", "postgresql", "mysql"] as Provider[]).forEach((p) => syncModels(cwd, p));

  console.log(`✓ Models synced for all providers`);

  // 2. Hints — remind to set DATABASE_PROVIDER / DATABASE_URL.
  console.log("");
  console.log("Next steps:");
  console.log("");
  console.log(`  1. Set DATABASE_PROVIDER=${provider} in .env (or Vercel dashboard)`);
  console.log("  2. Update DATABASE_URL in .env:");
  ENV_HINTS[provider].forEach((line) => console.log(`     ${line}`));
  console.log("");
  console.log("  3. Apply schema to the database:");
  console.log("     pnpm db:migrate     # generate + apply a new migration");
  console.log("     # OR (against an existing DB)");
  console.log("     pnpm db:deploy      # apply already-committed migrations");
  console.log("");

  // 3. Regenerate client against the requested schema.
  console.log("Regenerating Prisma client…");
  execSync(`DATABASE_PROVIDER=${provider} pnpm tsx scripts/db.ts generate`, {
    stdio: "inherit",
    cwd,
  });
}

main();
