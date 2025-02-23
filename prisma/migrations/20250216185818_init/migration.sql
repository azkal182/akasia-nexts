/*
  Warnings:

  - You are about to drop the column `note` on the `Expense` table. All the data in the column will be lost.
  - You are about to drop the column `totalAmount` on the `Expense` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `subtotal` on the `Item` table. All the data in the column will be lost.
  - Added the required column `total` to the `Expense` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Expense" DROP COLUMN "note",
DROP COLUMN "totalAmount",
ADD COLUMN     "total" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "name",
DROP COLUMN "price",
DROP COLUMN "subtotal",
ADD COLUMN     "armada" TEXT,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "total" INTEGER NOT NULL;
