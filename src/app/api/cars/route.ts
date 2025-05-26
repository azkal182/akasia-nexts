import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {


    try {
        // Ambil histori berdasarkan status 'COMPLETED' (yang sudah selesai)
        const cars = await prisma.car.findMany({})

        return NextResponse.json(cars);
    } catch (error) {
        return NextResponse.json({ message: 'Terjadi kesalahan', error }, { status: 500 });
    }
}
