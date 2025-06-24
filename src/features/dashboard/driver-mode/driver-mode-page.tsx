'use client';
import { CarResponse } from '@/actions/car';
import DriverTripCard from '@/app/dashboard/DriverTripCard';
import PageContainer from '@/components/layout/page-container';
import CarListing from '@/features/car/car-listing';
import React from 'react';
import { CurrentStatus } from '../../../../types/current-status';
import { useCurrentSession } from '@/hooks/use-current-user';

interface DriverModePageProps {
  currentStatus?: CurrentStatus[];
  onComplete?: ({ id, userId }: { id: string; userId: string }) => void;
  onGo?: () => void;
  cars?: CarResponse[];
}
const DriverModePage = ({
  currentStatus,
  onComplete,
  onGo,
  cars = []
}: DriverModePageProps) => {
  const { session } = useCurrentSession();
  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-4'>
        <h1 className='text-lg font-semibold'>
          Selamat Datang {session?.user.name}
        </h1>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
          {currentStatus &&
            currentStatus.length > 0 &&
            currentStatus.map((status) => (
              <DriverTripCard
                key={status.id}
                currentStatus={status}
                onComplete={({ id, userId }) => {
                  if (onComplete) {
                    onComplete({ id, userId });
                  }
                }}
              />
            ))}
        </div>

        <div>
          <CarListing
            cars={cars}
            goButton={true}
            onGo={() => {
              if (onGo) {
                onGo();
              }
            }}
            onComplete={onComplete}
          />
        </div>
      </div>
    </PageContainer>
  );
};

export default DriverModePage;
