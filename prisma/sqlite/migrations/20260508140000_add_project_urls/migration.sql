-- AlterTable: add optional URL columns to Project
ALTER TABLE "Project" ADD COLUMN "projectUrl" TEXT;
ALTER TABLE "Project" ADD COLUMN "githubUrl"  TEXT;
