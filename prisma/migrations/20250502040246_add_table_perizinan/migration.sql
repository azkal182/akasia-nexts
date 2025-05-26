-- CreateEnum
CREATE TYPE "PerizinanStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "Perizinan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "description" TEXT,
    "numberOfPassengers" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "estimation" INTEGER NOT NULL,
    "status" "PerizinanStatus" NOT NULL DEFAULT 'PENDING',
    "carId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Perizinan_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Perizinan" ADD CONSTRAINT "Perizinan_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
