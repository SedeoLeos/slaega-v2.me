-- CreateTable
CREATE TABLE "Pensee" (
    "id" TEXT NOT NULL,
    "kind" TEXT NOT NULL DEFAULT 'pensee',
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL DEFAULT '',
    "body" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pensee_pkey" PRIMARY KEY ("id")
);
