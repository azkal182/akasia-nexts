'use server';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export type CarResponse = Prisma.CarGetPayload<{}>;
export const getCars = async (): Promise<CarResponse[]> => {
  return await prisma.car.findMany();
};
