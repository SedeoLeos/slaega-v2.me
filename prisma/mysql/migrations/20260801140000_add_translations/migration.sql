-- AlterTable: per-language content overrides (JSON string, base = FR)
ALTER TABLE `Project` ADD COLUMN `translations` VARCHAR(191) NOT NULL DEFAULT '{}';
ALTER TABLE `Experience` ADD COLUMN `translations` VARCHAR(191) NOT NULL DEFAULT '{}';
