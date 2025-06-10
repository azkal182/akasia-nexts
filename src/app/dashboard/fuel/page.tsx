import React from 'react';
import FuelView from '@/features/fuel/fuel-view';
import PageContainer from '@/components/layout/page-container';
import CashflowPage from '@/app/dashboard/fuel/CashflowPage';
import { getCars } from '@/actions/car';
import { auth } from '@/lib/auth';

async function FuelPage() {
  const cars = await getCars();
  const session = await auth();
  const role = session!.user!.role;
  return (
    <PageContainer>
      <CashflowPage cars={cars} role={role} />
    </PageContainer>
  );
}

export default FuelPage;
