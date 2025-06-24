import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    // Ambil histori berdasarkan status 'COMPLETED' (yang sudah selesai)
    const cars = await prisma.car.findMany({});

    return NextResponse.json(cars);
  } catch (error) {
    return NextResponse.json(
      { message: 'Terjadi kesalahan', error },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await prisma.car.createMany({
      data: {
        name: body.name,
        barcodeString: body.barcodeString
      }
    });
    return NextResponse.json(body);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan', error },
      { status: 500 }
    );
  }
}
