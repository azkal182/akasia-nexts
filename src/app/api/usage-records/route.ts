import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const status: any = new URL(req.url).searchParams.get('status');

  try {
    // Ambil histori berdasarkan status 'COMPLETED' (yang sudah selesai)
    const usageRecords = await prisma.usageRecord.findMany({
      where: {
        status: status || 'COMPLETED' // Default 'COMPLETED'
      },
      include: {
        car: true,
        // driver: true,
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
