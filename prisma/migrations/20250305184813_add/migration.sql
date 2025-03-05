-- DropForeignKey
ALTER TABLE "Expense" DROP CONSTRAINT "Expense_transactionId_fkey";

-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_expenseId_fkey";

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_expenseId_fkey" FOREIGN KEY ("expenseId") REFERENCES "Expense"("id") ON DELETE CASCADE ON UPDATE CASCADE;
