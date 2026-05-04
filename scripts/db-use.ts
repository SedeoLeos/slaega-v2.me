#!/usr/bin/env tsx
/**
 * Switch the active Prisma datasource provider.
 *
 *   pnpm db:use sqlite           # local file (default)
 *   pnpm db:use postgresql       # Postgres / Supabase / Neon / Vercel Postgres
 *   pnpm db:use mysql            # MySQL / MariaDB / PlanetScale
 *
 * Mechanism:
 *   prisma/providers/<provider>.prisma   ──copy──▶  prisma/schema/datasource.prisma
 *
 * The schema folder is merged automatically by Prisma 7 (multi-file schema).
 * After switching, update DATABASE_URL in .env and run `pnpm db:migrate`.
 */
import { copyFileSync, existsSync } from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

type Provider = "sqlite" | "postgresql" | "mysql";

const ENV_HINTS: Record<Provider, string[]> = {
  sqlite: [`DATABASE_URL="file:./prisma/dev.db"`],
  postgresql: [
    `DATABASE_URL="postgresql://user:password@host:5432/dbname?schema=public"`,
    `# Supabase  : postgresql://postgres.[REF]:[PASS]@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true`,
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

function main() {
  const arg = process.argv[2];
  if (!arg || !isProvider(arg)) {
    console.error(`Usage: pnpm db:use <sqlite|postgresql|mysql>`);
    process.exit(1);
  }
  const provider: Provider = arg;

  const cwd = process.cwd();
  const src = path.join(cwd, "prisma", "providers", `${provider}.prisma`);
  const dest = path.join(cwd, "prisma", "schema", "datasource.prisma");

  if (!existsSync(src)) {
    console.error(`✗ Template not found: ${src}`);
    process.exit(1);
  }

  copyFileSync(src, dest);
  console.log(`✓ Active provider → ${provider}`);
  console.log(`  ${path.relative(cwd, src)}  →  ${path.relative(cwd, dest)}`);

  console.log("");
  console.log("Next steps:");
  console.log("");
  console.log("  1. Update DATABASE_URL in .env:");
  ENV_HINTS[provider].forEach((line) => console.log(`     ${line}`));
  console.log("");
  console.log("  2. Apply schema to the new database:");
  console.log("     pnpm db:migrate     # creates a new migration");
  console.log("     # OR (for an existing DB)");
  console.log("     pnpm db:deploy      # apply existing migrations");
  console.log("");

  console.log("Regenerating Prisma client…");
  execSync("pnpm prisma generate", { stdio: "inherit" });
}

main();
