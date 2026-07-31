-- AlterTable: add external link (e.g. Audiomack for a song)
ALTER TABLE `Pensee` ADD COLUMN `link` VARCHAR(191) NOT NULL DEFAULT '';
