-- CreateTable: Pensées / écrits (croyances, vision, réflexions, chansons)
CREATE TABLE "Pensee" (
    "id"        TEXT     NOT NULL PRIMARY KEY,
    "kind"      TEXT     NOT NULL DEFAULT 'pensee',
    "title"     TEXT     NOT NULL,
    "subtitle"  TEXT     NOT NULL DEFAULT '',
    "body"      TEXT     NOT NULL,
    "order"     INTEGER  NOT NULL DEFAULT 0,
    "published" BOOLEAN  NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
