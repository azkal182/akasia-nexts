import { getUsers } from '@/actions/users';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import UsersPageView from '@/features/profile/users-page-view';
import React from 'react';

const UsersPage = async () => {
  const users = await getUsers();
  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-4'>
        <UsersPageView users={users} />
      </div>
    </PageContainer>
  );
};

export default UsersPage;
