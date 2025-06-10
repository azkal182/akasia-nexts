// import prisma from '@/lib/prisma';
// import { NextResponse } from 'next/server';

// export async function PATCH(
//   req: Request,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   const { id } = await params;
//   const { endTime, userId } = await req.json();

//   try {
//     // Cek apakah usage record dengan ID tersebut ada dan masih 'ONGOING'
//     const usageRecord = await prisma.usageRecord.findUnique({
//       where: { id }
//     });

//     if (!usageRecord || usageRecord.status !== 'ONGOING') {
//       return NextResponse.json(
//         { message: 'Tidak ditemukan penggunaan yang sedang berlangsung' },
//         { status: 400 }
//       );
//     }

//     // Update UsageRecord dengan endTime dan status menjadi 'COMPLETED'
//     const updatedUsageRecord = await prisma.usageRecord.update({
//       where: { id },
//       data: {
//         endTime: new Date(endTime),
//         status: 'COMPLETED'
//       }
//     });

//     await prisma.car.update({
//       where: { id: usageRecord.carId },
//       data: { status: 'AVAILABLE' }
//     });

//     await prisma.user.update({
//       where: { id: userId },
//       data: { driving: false }
//     });

//     return NextResponse.json(updatedUsageRecord);
//   } catch (error) {
//     return NextResponse.json(
//       { message: 'Terjadi kesalahan', error },
//       { status: 500 }
//     );
//   }
// }

import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { endTime, userId } = await req.json();

  try {
    // Cek apakah usage record dengan ID tersebut ada dan masih 'ONGOING'
    const usageRecord = await prisma.usageRecord.findUnique({
      where: { id }
    });

    if (!usageRecord || usageRecord.status !== 'ONGOING') {
      return NextResponse.json(
        { message: 'Tidak ditemukan penggunaan yang sedang berlangsung' },
        { status: 400 }
      );
    }

    // Cek jumlah usage record dengan status ONGOING untuk userId
    const ongoingRecordsCount = await prisma.usageRecord.count({
      where: {
        userId,
        status: 'ONGOING'
      }
    });

    // Update UsageRecord dengan endTime dan status menjadi 'COMPLETED'
    const updatedUsageRecord = await prisma.usageRecord.update({
      where: { id },
      data: {
        endTime: new Date(endTime),
        status: 'COMPLETED'
      }
    });

    // Update status mobil menjadi 'AVAILABLE'
    await prisma.car.update({
      where: { id: usageRecord.carId },
      data: { status: 'AVAILABLE' }
    });

    // Set driving ke false hanya jika hanya ada 1 usage record ONGOING
    if (ongoingRecordsCount === 1) {
      await prisma.user.update({
        where: { id: userId },
        data: { driving: false }
      });
    }

    return NextResponse.json(updatedUsageRecord);
  } catch (error) {
    return NextResponse.json(
      { message: 'Terjadi kesalahan', error },
      { status: 500 }
    );
  }
}
