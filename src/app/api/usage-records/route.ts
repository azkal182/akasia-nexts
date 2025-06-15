import prisma from '@/lib/prisma';
import { UsageRecord, UsageStatus } from '@prisma/client';
import { NextResponse } from 'next/server';

function getLocalDate(year: number, month: number, day: number): Date {
  const utcDate = new Date(Date.UTC(year, month, day));
  // geser +7 jam ke depan
  utcDate.setUTCHours(utcDate.getUTCHours() - 7);
  return utcDate;
}
export async function GET(req: Request) {
  const url = new URL(req.url);
  const status = url.searchParams.get('status') || ('COMPLETED' as UsageStatus);
  const monthParam = url.searchParams.get('month');
  const yearParam = url.searchParams.get('year');

  const month = monthParam ? parseInt(monthParam) : null;
  const year = yearParam ? parseInt(yearParam) : null;

  let dateFilter = {};

  if (month !== null && year !== null) {
    const startDate = getLocalDate(year, month - 1, 1); // bulan dalam JS: 0-based
    const endDate = getLocalDate(year, month, 1); // awal bulan berikutnya

    dateFilter = {
      createdAt: {
        gte: startDate,
        lt: endDate
      }
    };
  }

  try {
    const usageRecords = await prisma.usageRecord.findMany({
      where: {
        status: status as UsageStatus,
        ...dateFilter
      },
      include: {
        car: true,
        User: true
      }
    });

    return NextResponse.json(usageRecords);
  } catch (error) {
    return NextResponse.json(
      { message: 'Terjadi kesalahan', error },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const { carId, userId, purpose, destination } = await req.json();

  try {
    // Cek apakah mobil dalam status 'AVAILABLE'
    const car = await prisma.car.findUnique({
      where: { id: carId }
    });

    if (!car || car.status !== 'AVAILABLE') {
      return NextResponse.json(
        { message: 'Mobil tidak tersedia' },
        { status: 400 }
      );
    }

    // Create UsageRecord baru
    const usageRecord = await prisma.usageRecord.create({
      data: {
        carId,
        userId,
        purpose,
        destination,
        startTime: new Date(),
        status: 'ONGOING' // status masih ongoing
      }
    });

    // Update status mobil menjadi 'IN_USE'
    await prisma.car.update({
      where: { id: carId },
      data: { status: 'IN_USE' }
    });

    await prisma.user.update({
      where: { id: userId },
      data: { driving: true } // Update status user jika diperlukan
    });

    return NextResponse.json(usageRecord);
  } catch (error) {
    return NextResponse.json(
      { message: 'Terjadi kesalahan', error },
      { status: 500 }
    );
  }
}
