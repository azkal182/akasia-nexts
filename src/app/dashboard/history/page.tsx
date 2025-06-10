import { getRecords } from '@/actions/usage-record';
import PageContainer from '@/components/layout/page-container';
import CarUsageHistory from '@/features/history/components/CarUsageHistory';
import React from 'react';

const HistoryPage = async () => {
  const records = await getRecords();
  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-4'>
        <CarUsageHistory data={records} />
      </div>
    </PageContainer>
  );
};

export default HistoryPage;
