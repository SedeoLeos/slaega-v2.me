-- AlterTable: add optional video URL to Project
ALTER TABLE `Project`
    ADD COLUMN `videoUrl` VARCHAR(191) NULL;
