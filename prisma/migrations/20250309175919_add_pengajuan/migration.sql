-- CreateTable
CREATE TABLE "Pengajuan" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pengajuan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PengajuanItem" (
    "id" TEXT NOT NULL,
    "requirement" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "estimation" INTEGER NOT NULL,
    "pengajuanId" TEXT,

    CONSTRAINT "PengajuanItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PengajuanItem" ADD CONSTRAINT "PengajuanItem_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Car"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PengajuanItem" ADD CONSTRAINT "PengajuanItem_pengajuanId_fkey" FOREIGN KEY ("pengajuanId") REFERENCES "Pengajuan"("id") ON DELETE SET NULL ON UPDATE CASCADE;
