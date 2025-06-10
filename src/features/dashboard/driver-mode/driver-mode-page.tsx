'use client';
import { CarResponse, getCars } from '@/actions/car';
import DriverTripCard from '@/app/dashboard/DriverTripCard';
import { UsageRecord } from '@/app/dashboard/page';
import PageContainer from '@/components/layout/page-container';
import CarListing from '@/features/car/car-listing';
import React from 'react';

interface DriverModePageProps {
  currentStatus?: UsageRecord | null;
  onComplete?: ({ id, userId }: { id: string; userId: string }) => void;
  onGo?: () => void;
}
const DriverModePage = ({
  currentStatus,
  onComplete,
  onGo
}: DriverModePageProps) => {
  const [cars, setCars] = React.useState<CarResponse[]>([]);
  React.useEffect(() => {
    // Simulate fetching cars data
    const fetchCars = async () => {
      // Replace with actual API call
      const fetchedCars = await await getCars();
      setCars(fetchedCars);
    };

    fetchCars();
  }, []);
  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-4'>
        <h1 className='text-lg font-semibold'>
          Selamat Datang di Dashboard Driver
        </h1>
        {currentStatus ? (
          <DriverTripCard
            currentStatus={currentStatus}
            onComplete={(data) => onComplete?.(data)}
          />
        ) : (
          <div>
            <CarListing
              cars={cars}
              goButton={true}
              onGo={() => {
                if (onGo) {
                  onGo();
                }
              }}
            />
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default DriverModePage;
