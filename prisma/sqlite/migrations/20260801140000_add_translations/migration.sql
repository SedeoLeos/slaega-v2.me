-- AlterTable: per-language content overrides (JSON string, base = FR)
ALTER TABLE "Project" ADD COLUMN "translations" TEXT NOT NULL DEFAULT '{}';
ALTER TABLE "Experience" ADD COLUMN "translations" TEXT NOT NULL DEFAULT '{}';
