-- AlterTable: add optional URL columns to Project
ALTER TABLE `Project`
    ADD COLUMN `projectUrl` VARCHAR(191) NULL,
    ADD COLUMN `githubUrl`  VARCHAR(191) NULL;
