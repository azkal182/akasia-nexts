-- DropForeignKey
ALTER TABLE "CashIncome" DROP CONSTRAINT "CashIncome_cashflowId_fkey";

-- DropForeignKey
ALTER TABLE "FuelUsage" DROP CONSTRAINT "FuelUsage_cashflowId_fkey";

-- AddForeignKey
ALTER TABLE "CashIncome" ADD CONSTRAINT "CashIncome_cashflowId_fkey" FOREIGN KEY ("cashflowId") REFERENCES "Cashflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FuelUsage" ADD CONSTRAINT "FuelUsage_cashflowId_fkey" FOREIGN KEY ("cashflowId") REFERENCES "Cashflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;
