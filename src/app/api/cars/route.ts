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
    console.log(JSON.stringify(body, null, 2));
    return NextResponse.json(body);
  } catch (error) {
    return NextResponse.json(
      { message: 'Terjadi kesalahan', error },
      { status: 500 }
    );
  }
}
