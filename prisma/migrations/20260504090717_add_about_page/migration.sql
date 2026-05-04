-- CreateTable
CREATE TABLE "AboutPage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "label" TEXT NOT NULL DEFAULT 'Apprenez à me connaître',
    "title" TEXT NOT NULL DEFAULT 'À propos',
    "intro" TEXT NOT NULL DEFAULT '',
    "body" TEXT NOT NULL DEFAULT '',
    "highlights" TEXT NOT NULL DEFAULT '[]',
    "ctaText" TEXT NOT NULL DEFAULT 'Télécharger le CV',
    "ctaHref" TEXT NOT NULL DEFAULT '/cv.pdf',
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
