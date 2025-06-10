import prisma from '@/lib/prisma';
import { UsageStatus } from '@prisma/client';
import { Prisma } from '@prisma/client';

export type RecordResponse = Prisma.UsageRecordGetPayload<{
  include: {
    car: true;
    User: true;
  };
}>;
export const getRecords = async (status?: string) => {
  try {
    const usageRecords = await prisma.usageRecord.findMany({
      where: {
        status: (status as UsageStatus) || ('COMPLETED' as UsageStatus)
      }, // Default to 'COMPLETED'
      include: {
        car: true,
        User: true
      }
    });

    return usageRecords;
  } catch (error) {
    console.error('Error fetching usage records:', error);
    throw new Error('Failed to fetch usage records');
  }
};
