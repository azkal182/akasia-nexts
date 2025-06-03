/*
  Warnings:

  - You are about to drop the `FuelTransaction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `IncomeFirFuel` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "CashflowType" AS ENUM ('INCOME', 'EXPENSE');

-- CreateEnum
CREATE TYPE "FuelType" AS ENUM ('SOLAR', 'BENSIN');

-- DropForeignKey
ALTER TABLE "FuelTransaction" DROP CONSTRAINT "FuelTransaction_carId_fkey";

-- DropForeignKey
ALTER TABLE "FuelTransaction" DROP CONSTRAINT "FuelTransaction_incomeId_fkey";

-- DropTable
DROP TABLE "FuelTransaction";

-- DropTable
DROP TABLE "IncomeFirFuel";

-- CreateTable
CREATE TABLE "Cashflow" (
    "id" TEXT NOT NULL,
    "type" "CashflowType" NOT NULL,
    "amount" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,

    CONSTRAINT "Cashflow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CashIncome" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "notes" TEXT,
    "cashflowId" TEXT NOT NULL,

    CONSTRAINT "CashIncome_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FuelUsage" (
    "id" TEXT NOT NULL,
    "carId" TEXT NOT NULL,
    "fuelType" "FuelType" NOT NULL,
    "receiptFile" TEXT,
    "cashflowId" TEXT NOT NULL,

    CONSTRAINT "FuelUsage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CashIncome_cashflowId_key" ON "CashIncome"("cashflowId");

-- CreateIndex
CREATE UNIQUE INDEX "FuelUsage_cashflowId_key" ON "FuelUsage"("cashflowId");

-- AddForeignKey
ALTER TABLE "CashIncome" ADD CONSTRAINT "CashIncome_cashflowId_fkey" FOREIGN KEY ("cashflowId") REFERENCES "Cashflow"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FuelUsage" ADD CONSTRAINT "FuelUsage_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FuelUsage" ADD CONSTRAINT "FuelUsage_cashflowId_fkey" FOREIGN KEY ("cashflowId") REFERENCES "Cashflow"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
