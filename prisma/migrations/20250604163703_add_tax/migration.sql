-- CreateEnum
CREATE TYPE "TaxType" AS ENUM ('ANNUAL', 'FIVE_YEAR');

-- CreateTable
CREATE TABLE "Tax" (
    "id" TEXT NOT NULL,
    "carId" TEXT NOT NULL,
    "type" "TaxType" NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "siPaid" BOOLEAN NOT NULL DEFAULT false,
    "paidAt" TIMESTAMP(3),
    "notes" TEXT,

    CONSTRAINT "Tax_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaxPayment" (
    "id" TEXT NOT NULL,
    "taxId" TEXT NOT NULL,
    "paidAt" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,

    CONSTRAINT "TaxPayment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Tax" ADD CONSTRAINT "Tax_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxPayment" ADD CONSTRAINT "TaxPayment_taxId_fkey" FOREIGN KEY ("taxId") REFERENCES "Tax"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
