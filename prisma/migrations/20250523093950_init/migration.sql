-- CreateTable
CREATE TABLE "Gonullu" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tarih" DATETIME NOT NULL,
    "saatBasla" TEXT NOT NULL,
    "saatBitis" TEXT NOT NULL,
    "alan" TEXT NOT NULL,
    "catering" BOOLEAN NOT NULL,
    "dosyaYolu" TEXT NOT NULL
);
