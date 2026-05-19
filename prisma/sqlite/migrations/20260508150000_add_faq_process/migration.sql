-- CreateTable: FAQ accordion items
CREATE TABLE "FaqItem" (
    "id"        TEXT    NOT NULL PRIMARY KEY,
    "question"  TEXT    NOT NULL,
    "answer"    TEXT    NOT NULL,
    "order"     INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable: Process / methodology steps
CREATE TABLE "ProcessStep" (
    "id"          TEXT    NOT NULL PRIMARY KEY,
    "stepNumber"  INTEGER NOT NULL,
    "label"       TEXT    NOT NULL,
    "title"       TEXT    NOT NULL,
    "description" TEXT    NOT NULL,
    "order"       INTEGER NOT NULL DEFAULT 0,
    "published"   BOOLEAN NOT NULL DEFAULT true,
    "createdAt"   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   DATETIME NOT NULL
);
