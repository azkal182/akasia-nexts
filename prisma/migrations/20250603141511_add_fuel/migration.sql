-- CreateTable
CREATE TABLE "IncomeFirFuel" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "receivedAt" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,

    CONSTRAINT "IncomeFirFuel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FuelTransaction" (
    "id" SERIAL NOT NULL,
    "carId" TEXT NOT NULL,
    "incomeId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "liters" DECIMAL(6,2) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,

    CONSTRAINT "FuelTransaction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FuelTransaction" ADD CONSTRAINT "FuelTransaction_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FuelTransaction" ADD CONSTRAINT "FuelTransaction_incomeId_fkey" FOREIGN KEY ("incomeId") REFERENCES "IncomeFirFuel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
