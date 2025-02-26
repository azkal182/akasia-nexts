import { getCars } from "@/actions/car";
import PageContainer from "@/components/layout/page-container";
import CarListing from "@/features/car/car-listing";
import React from "react";

const CarsPage = async () => {
  const cars = await getCars();
  return (
    <PageContainer>
      <div className="flex flex-1 flex-col space-y-4">
        <CarListing cars={cars} />
      </div>
    </PageContainer>
  );
};

export default CarsPage;
