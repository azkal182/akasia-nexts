import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await auth();
    // Ambil data mobil yang tersedia
    const user = await prisma.user.findFirst({
      where: { id: session?.user.id },
      include: {
        usageRecords: {
          where: {
            status: 'ONGOING'
          },
          include: {
            car: true
          }
        }
      }
    });
    if (!user) {
      return NextResponse.json(
        { message: 'Pengguna tidak ditemukan' },
        { status: 404 }
      );
    }

    const ongoingRecord = await prisma.usageRecord.findMany({
      where: {
        userId: session?.user.id,
        status: 'ONGOING'
      },
      include: {
        car: true,
        User: true
      }
    });

    return NextResponse.json(ongoingRecord);
  } catch (error) {
    return NextResponse.json(
      { message: 'Terjadi kesalahan', error },
      { status: 500 }
    );
  }
}
