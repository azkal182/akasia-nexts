/*
  Warnings:

  - You are about to drop the column `driverId` on the `UsageRecord` table. All the data in the column will be lost.
  - You are about to drop the `Driver` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UsageRecord" DROP CONSTRAINT "UsageRecord_driverId_fkey";

-- AlterTable
ALTER TABLE "UsageRecord" DROP COLUMN "driverId";

-- DropTable
DROP TABLE "Driver";
