'use server';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export type CarResponse = Prisma.CarGetPayload<{
  include: {
    usageRecords: {
      include: {
        User: true;
      };
    };
  };
}>;

export const getCarByBarcode = async (
  barcodeString: string
): Promise<CarResponse | null> => {
  try {
    const data = await prisma.car.findFirst({
      where: {
        barcodeString: barcodeString
      },
      orderBy: { name: 'asc' },
      include: {
        usageRecords: {
          include: {
            User: true
          }
        }
      }
    });
    console.log(JSON.stringify(data, null, 2));

    return data;
  } catch (error) {
    return null;
  }
};

export const getCarById = async (id: string): Promise<CarResponse | null> => {
  try {
    const data = await prisma.car.findUnique({
      where: {
        id: id
      },
      include: {
        usageRecords: {
          include: {
            User: true
          }
        }
      }
    });
    console.log(JSON.stringify(data, null, 2));

    return data;
  } catch (error) {
    return null;
  }
};
export const getCars = async (): Promise<CarResponse[]> => {
  const data = await prisma.car.findMany({
    orderBy: { name: 'asc' },
    include: {
      usageRecords: {
        where: { status: 'ONGOING' },
        include: {
          User: true
        }
      }
    }
  });
  console.log(JSON.stringify(data, null, 2));

  return data;
};
