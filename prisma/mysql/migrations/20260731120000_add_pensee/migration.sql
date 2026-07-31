-- CreateTable: Pensées / écrits (croyances, vision, réflexions, chansons)
CREATE TABLE `Pensee` (
    `id`        VARCHAR(191) NOT NULL,
    `kind`      VARCHAR(191) NOT NULL DEFAULT 'pensee',
    `title`     VARCHAR(191) NOT NULL,
    `subtitle`  VARCHAR(191) NOT NULL DEFAULT '',
    `body`      TEXT         NOT NULL,
    `order`     INTEGER      NOT NULL DEFAULT 0,
    `published` BOOLEAN      NOT NULL DEFAULT true,
    `createdAt` DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3)  NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
