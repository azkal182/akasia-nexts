/*
  Warnings:

  - You are about to drop the column `siPaid` on the `Tax` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Tax" DROP COLUMN "siPaid",
ADD COLUMN     "isPaid" BOOLEAN NOT NULL DEFAULT false;
