import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    const { endTime } = await req.json();

    try {
        // Cek apakah usage record dengan ID tersebut ada dan masih 'ONGOING'
        const usageRecord = await prisma.usageRecord.findUnique({
            where: { id },
        });

        if (!usageRecord || usageRecord.status !== 'ONGOING') {
            return NextResponse.json({ message: 'Tidak ditemukan penggunaan yang sedang berlangsung' }, { status: 400 });
        }

        // Update UsageRecord dengan endTime dan status menjadi 'COMPLETED'
        const updatedUsageRecord = await prisma.usageRecord.update({
            where: { id },
            data: {
                endTime: new Date(endTime),
                status: 'COMPLETED',
            },
        });

        // Update status mobil menjadi 'AVAILABLE'
        await prisma.car.update({
            where: { id: usageRecord.carId },
            data: { status: 'AVAILABLE' },
        });

        return NextResponse.json(updatedUsageRecord);
    } catch (error) {
        return NextResponse.json({ message: 'Terjadi kesalahan', error }, { status: 500 });
    }
}
