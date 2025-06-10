import { Prisma } from '@prisma/client';

export type CurrentStatus = Prisma.UsageRecordGetPayload<{
  include: {
    car: true;
    User: true;
  };
}>;
