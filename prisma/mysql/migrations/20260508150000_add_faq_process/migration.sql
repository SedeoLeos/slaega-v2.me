-- CreateTable: FAQ accordion items
CREATE TABLE `FaqItem` (
    `id`        VARCHAR(191) NOT NULL,
    `question`  TEXT         NOT NULL,
    `answer`    TEXT         NOT NULL,
    `order`     INTEGER      NOT NULL DEFAULT 0,
    `published` BOOLEAN      NOT NULL DEFAULT true,
    `createdAt` DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3)  NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable: Process / methodology steps
CREATE TABLE `ProcessStep` (
    `id`          VARCHAR(191) NOT NULL,
    `stepNumber`  INTEGER      NOT NULL,
    `label`       VARCHAR(191) NOT NULL,
    `title`       VARCHAR(191) NOT NULL,
    `description` TEXT         NOT NULL,
    `order`       INTEGER      NOT NULL DEFAULT 0,
    `published`   BOOLEAN      NOT NULL DEFAULT true,
    `createdAt`   DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt`   DATETIME(3)  NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
